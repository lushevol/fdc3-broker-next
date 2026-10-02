#!/usr/bin/env python3
"""Build a small function-entitlement POC from supplied EMS2 configuration."""

import argparse
import csv
import json
from pathlib import Path
import xml.etree.ElementTree as ET


POC_DIR = Path(__file__).resolve().parent
REPO_ROOT = POC_DIR.parents[4]
SELECTED_TILE_IDS = {1, 2, 3, 4, 18, 54, 104, 105}
APPLICATIONS = (
    {
        "filename": "entitlements.xml",
        "entityId": 1,
        "entityName": "X_RATANONE",
        "appName": "RATAN_ENTITLEMENT_RULE",
        "appId": "51358",
        "appUID": 10,
        "roleNames": {"FMO_COO_SUP", "FMO_KR_OPS"},
    },
    {
        "filename": "entitlements_fmo_portal_admin.xml",
        "entityId": 2,
        "entityName": "FMO PORTAL ADMIN",
        "appName": "FMO_PORTAL_ADMIN",
        "appId": "51358",
        "appUID": 11,
        "roleNames": {"FMO_ADMIN"},
    },
)


def required_text(element, path):
    value = element.findtext(path)
    if value is None or not value.strip():
        raise ValueError(f"Missing XML value: {path}")
    return value.strip()


def load_grants(data_dir):
    grants = {}
    long_names = {}
    for app in APPLICATIONS:
        root = ET.parse(data_dir / app["filename"]).getroot()
        entity = required_text(root, "entity/name")
        if entity != app["entityName"]:
            raise ValueError(f"Unexpected entity in {app['filename']}: {entity}")
        selected = set()
        for entitlement in root.findall("entitlement"):
            role = required_text(entitlement, "role/name")
            if role not in app["roleNames"]:
                continue
            subject = required_text(entitlement, "subject/name")
            long_name = required_text(entitlement, "subject/longName")
            action = required_text(entitlement, "action/name")
            subject_key = (entity, subject)
            if subject_key in long_names and long_names[subject_key] != long_name:
                raise ValueError(f"Conflicting longName for {subject_key}")
            long_names[subject_key] = long_name
            selected.add((entity, role, subject, action))
        if {grant[1] for grant in selected} != app["roleNames"]:
            raise ValueError(f"Required POC role missing in {app['filename']}")
        grants[entity] = sorted(selected)
    return grants, long_names


def build_catalog(grants, long_names):
    identities = set()
    for entity_grants in grants.values():
        for entity, role, subject, action in entity_grants:
            identities.update(
                (
                    ("role", entity, role),
                    ("subject", entity, subject),
                    ("action", entity, subject, action),
                    ("entitlement", entity, role, subject, action),
                )
            )
    ids = {identity: 10001 + index for index, identity in enumerate(sorted(identities))}
    catalog = []
    for app in APPLICATIONS:
        entity = app["entityName"]
        roles = []
        for role_name in sorted(app["roleNames"]):
            role_grants = [grant for grant in grants[entity] if grant[1] == role_name]
            subjects = []
            for subject_name in sorted({grant[2] for grant in role_grants}):
                actions = [
                    {
                        "id": ids[("action", entity, subject_name, grant[3])],
                        "name": grant[3],
                        "entitlementId": ids[
                            ("entitlement", entity, role_name, subject_name, grant[3])
                        ],
                    }
                    for grant in role_grants
                    if grant[2] == subject_name
                ]
                subjects.append(
                    {
                        "id": ids[("subject", entity, subject_name)],
                        "name": subject_name,
                        "longName": long_names[(entity, subject_name)],
                        "actions": actions,
                    }
                )
            roles.append(
                {
                    "roleName": role_name,
                    "roleId": ids[("role", entity, role_name)],
                    "subjects": subjects,
                }
            )
        catalog.append(
            {
                key: value
                for key, value in app.items()
                if key not in {"filename", "roleNames"}
            }
            | {"roles": roles}
        )
    return catalog


def build_tiles(data_dir):
    with (data_dir / "application_category.csv").open(encoding="utf-8-sig", newline="") as file:
        labels = {
            int(row["application_category_id"]): row["label"]
            for row in csv.DictReader(file)
        }
    tiles = []
    with (data_dir / "application_tile.csv").open(encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            tile_id = int(row["application_tile_id"])
            if tile_id not in SELECTED_TILE_IDS:
                continue
            category_id = int(row["application_category_id"])
            tiles.append(
                {
                    "id": tile_id,
                    "title": row["title"],
                    "categoryId": category_id,
                    "categoryLabel": labels[category_id],
                    "entities": [
                        entity.strip()
                        for entity in row["ems2_entities"].split(",")
                        if entity.strip()
                    ],
                    "subject": row["ems2_subject"],
                    "isTemplate": row["is_template"].lower() == "true",
                }
            )
    if {tile["id"] for tile in tiles} != SELECTED_TILE_IDS:
        raise ValueError("A selected POC tile is missing from application_tile.csv")
    tiles.extend(
        (
            {
                "id": 9001,
                "title": "Synthetic Template",
                "categoryId": 9001,
                "categoryLabel": "POC Edge Cases",
                "entities": [],
                "subject": "",
                "isTemplate": True,
            },
            {
                "id": 9002,
                "title": "Synthetic Blank Subject",
                "categoryId": 9001,
                "categoryLabel": "POC Edge Cases",
                "entities": ["X_RATANONE"],
                "subject": "",
                "isTemplate": False,
            },
            {
                "id": 9003,
                "title": "Synthetic Wrong Entity",
                "categoryId": 9001,
                "categoryLabel": "POC Edge Cases",
                "entities": ["OTHER"],
                "subject": "RATAN_TRADE_BLOTTER",
                "isTemplate": False,
            },
            {
                "id": 9004,
                "title": "Synthetic Long Name Match",
                "categoryId": 9001,
                "categoryLabel": "POC Edge Cases",
                "entities": ["X_RATANONE"],
                "subject": "/ratan_fm_coo_rule",
                "isTemplate": False,
            },
        )
    )
    return sorted(tiles, key=lambda tile: tile["id"])


def build_accounts():
    ratan = {"entityName": "X_RATANONE", "roleName": "FMO_COO_SUP"}
    admin = {"entityName": "FMO PORTAL ADMIN", "roleName": "FMO_ADMIN"}
    return {
        "poc-ratan": [ratan],
        "poc-admin": [admin],
        "poc-both": [ratan, admin],
        "poc-two-roles": [
            ratan,
            {"entityName": "X_RATANONE", "roleName": "FMO_KR_OPS"},
        ],
        "poc-none": [],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, default=REPO_ROOT / "scb-next/data")
    parser.add_argument("--output-dir", type=Path, default=POC_DIR / "fixtures")
    args = parser.parse_args()
    grants, long_names = load_grants(args.data_dir)
    outputs = {
        "catalog.json": build_catalog(grants, long_names),
        "tiles.json": build_tiles(args.data_dir),
        "accounts.json": build_accounts(),
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for filename, value in outputs.items():
        (args.output_dir / filename).write_text(
            json.dumps(value, indent=2, ensure_ascii=True) + "\n", encoding="utf-8"
        )
    grant_count = sum(len(entity_grants) for entity_grants in grants.values())
    print(f"Prepared {len(APPLICATIONS)} apps, {grant_count} grants, "
          f"{len(outputs['tiles.json'])} tiles, {len(outputs['accounts.json'])} synthetic accounts")


if __name__ == "__main__":
    main()
