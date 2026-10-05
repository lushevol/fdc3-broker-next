#!/usr/bin/env python3
"""Produce a sanitized, source-linked input for the actual BFF tile replay."""

import argparse
import csv
import json
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.parsers import expat


SERVICE = Path(__file__).resolve().parents[2]
REPO = SERVICE.parents[1]
POC = SERVICE / 'poc/ems3-functions/fixtures'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--data-dir', type=Path, default=REPO / 'scb-next/data')
parser.add_argument('--output', type=Path, default=SERVICE / 'docs/evidence/ems3-scenario-input.json')
args = parser.parse_args()
DATA = args.data_dir.resolve()
OUT = args.output.resolve()
SQL = ('SELECT c.application_category_id, c.label, m.key_name, t.*  '
       'FROM application_category c, application_tile t, import_map m '
       'WHERE c.application_category_id=t.application_category_id '
       'and t.import_map_id=m.import_map_id and c.is_active = true '
       'and t.is_active = true and m.is_active = true '
       'order by c.order_no, t.order_no')


def value(key, raw):
    if raw == 'NULL':
        return None
    if key in {'is_active', 'is_template'}:
        return raw.lower() == 'true'
    if key.endswith('_id') or key == 'order_no':
        return int(raw)
    return raw


def read_csv(name, fields):
    path = DATA / (name + '.csv')
    result = []
    with path.open(encoding='utf-8-sig', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            item = {key: value(key, row[key]) for key in fields}
            item['source'] = {'file': str(path), 'line': reader.line_num}
            result.append(item)
    return result


tiles = read_csv('application_tile', [
    'is_active', 'is_template', 'application_category_id', 'application_tile_id',
    'import_map_id', 'ems2_entities', 'ems2_role', 'ems2_subject',
    'image_dark_theme', 'image_light_theme', 'module', 'subtitle', 'tile',
    'title', 'order_no', 'filter_rule', 'entry_name'])
for tile in tiles:
    tile['email_support'] = ''
categories = read_csv('application_category', [
    'is_active', 'application_category_id', 'ems2_role', 'label', 'order_no'])
imports = read_csv('import_map', [
    'is_active', 'import_map_id', 'ems2_role', 'key_name', 'path'])

xml_catalogs = []
for path in sorted(DATA.glob('*.xml')):
    spans = []
    parser = expat.ParserCreate()

    def start(tag, attrs):
        if tag == 'entitlement':
            spans.append({'line': parser.CurrentLineNumber})

    def end(tag):
        if tag == 'entitlement':
            spans[-1]['endLine'] = parser.CurrentLineNumber

    parser.StartElementHandler = start
    parser.EndElementHandler = end
    parser.Parse(path.read_bytes(), True)
    root = ET.parse(path).getroot()
    grants = []
    for index, (element, span) in enumerate(zip(root.findall('entitlement'), spans, strict=True), 1):
        grants.append({
            'roleName': element.findtext('role/name'),
            'subject': element.findtext('subject/name'),
            'longName': element.findtext('subject/longName'),
            'action': element.findtext('action/name'),
            'source': {'file': str(path), 'entitlementIndex': index, **span},
        })
    xml_catalogs.append({
        'entityName': root.findtext('entity/name'),
        'sourceFile': str(path),
        'grants': grants,
    })

category_index = {row['application_category_id']: row for row in categories}
import_index = {row['import_map_id']: row for row in imports}
candidates = []
excluded = []
for tile in tiles:
    category = category_index.get(tile['application_category_id'])
    imp = import_index.get(tile['import_map_id'])
    reasons = []
    if category is None:
        reasons.append('missing category')
    elif not category['is_active']:
        reasons.append('inactive category')
    if not tile['is_active']:
        reasons.append('inactive tile')
    if imp is None:
        reasons.append('missing import map')
    elif not imp['is_active']:
        reasons.append('inactive import map')
    if reasons:
        excluded.append({'id': tile['application_tile_id'], 'reasons': reasons})
    else:
        candidates.append(tile)
candidates.sort(key=lambda row: (
    category_index[row['application_category_id']]['order_no'], row['order_no']))

grants_by_role = {}
for catalog in xml_catalogs:
    for grant in catalog['grants']:
        grants_by_role.setdefault((catalog['entityName'], grant['roleName']), []).append(grant)


def visible(account):
    subjects_by_entity = {}
    for role in account:
        key = (role['entityName'], role['roleName'])
        subjects = subjects_by_entity.setdefault(key[0], set())
        for grant in grants_by_role.get(key, []):
            subjects.update(name.lower() for name in (grant['subject'], grant['longName']) if name)
    result = []
    for tile in candidates:
        tile_entities = {name.strip() for name in (tile['ems2_entities'] or '').split(',') if name.strip()}
        matches = tile_entities & subjects_by_entity.keys()
        subject = tile['ems2_subject'] or ''
        if tile['is_template'] or (matches and (
                not subject.strip() or any(subject.lower() in subjects_by_entity[name] for name in matches))):
            result.append(tile['application_tile_id'])
    return result


accounts = json.loads((POC / 'accounts.json').read_text())
known_predictions = {name: visible(account) for name, account in accounts.items()}
single_role_predictions = [
    {'entityName': entity, 'roleName': role,
     'visibleTileIds': visible([{'entityName': entity, 'roleName': role}])}
    for entity, role in sorted(grants_by_role)
]
output = {
    'notes': [
        'Synthetic account-to-role assignments are from committed POC fixtures; no production user assignments were supplied.',
        'Candidate/visibility lists are independent parser predictions; compare ScenarioReport results for executed evidence.',
        'Support emails and created/updated-by metadata are excluded. email_support is deliberately blank.',
        'CSV NULL sentinel is converted to JSON null; source lines are CSV reader physical end-line numbers.',
        'filter_rule and entry_name are preserved for evidence but existing AdminModuleUtil does not consume them.',
    ],
    'candidateSql': SQL,
    'categories': categories,
    'importMaps': imports,
    'tiles': tiles,
    'xmlCatalogs': xml_catalogs,
    'syntheticAccounts': accounts,
    'selectedPocTiles': json.loads((POC / 'tiles.json').read_text()),
    'selectedPocCatalog': json.loads((POC / 'catalog.json').read_text()),
    'candidateTileIds': [row['application_tile_id'] for row in candidates],
    'excludedTiles': excluded,
    'templateCandidateTileIds': [row['application_tile_id'] for row in candidates if row['is_template']],
    'knownAccountPredictions': known_predictions,
    'singleRolePredictions': single_role_predictions,
    'stats': {
        'tileRows': len(tiles), 'categoryRows': len(categories), 'importMapRows': len(imports),
        'candidateRows': len(candidates), 'excludedRows': len(excluded),
        'templateCandidates': sum(row['is_template'] for row in candidates),
        'xmlGrantRows': sum(len(catalog['grants']) for catalog in xml_catalogs),
        'xmlEntityCount': len(xml_catalogs), 'singleRoleCount': len(single_role_predictions),
        'candidateEntityCount': len({name.strip() for row in candidates
                                    for name in (row['ems2_entities'] or '').split(',') if name.strip()}),
    },
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(output, indent=2, ensure_ascii=True) + '\n')
print(json.dumps({'path': str(OUT), 'stats': output['stats'], 'knownPredictions': known_predictions}, indent=2))
