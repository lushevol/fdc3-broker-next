package com.scb.sso.singleuibff.util;

import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class AdminModuleUtilTest {

    private AdminModuleUtil adminModuleUtil;

    @BeforeEach
    void setUp() {
        // Use the all-args constructor with nulls for unused dependencies
        adminModuleUtil = new AdminModuleUtil(null, null, null, null);
    }

    @Test
    void filterDrawers_shouldReturnDrawerWithTemplateTile() {
        Map<String, Object> tile = new HashMap<>();
        tile.put("isTemplate", true);
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("tiles", List.of(tile));
        List<Map<String, Object>> drawers = List.of(drawer);

        List<Entity> entities = Collections.emptyList();

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(1, result.size());
        List<Map<String, Object>> resultTiles = (List<Map<String, Object>>) result.get(0).get("tiles");
        assertEquals(1, resultTiles.size());
        assertTrue((Boolean) resultTiles.get(0).get("isTemplate"));
    }

    @Test
    void filterDrawers_shouldReturnDrawerWithEntityTileAndEmptySubject() {
        Map<String, Object> tile = new HashMap<>();
        tile.put("isTemplate", false);
        tile.put("entity", new String[] { "entity1" });
        tile.put("subject", "");

        Map<String, Object> drawer = new HashMap<>();
        drawer.put("tiles", List.of(tile));

        Entity entity = new Entity();
        entity.setName("entity1");
        entity.setSubjects(Collections.emptyList());

        List<Map<String, Object>> drawers = List.of(drawer);
        List<Entity> entities = List.of(entity);

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(1, result.size());
        List<Map<String, Object>> resultTiles = (List<Map<String, Object>>) result.get(0).get("tiles");
        assertEquals(1, resultTiles.size());
        assertFalse((Boolean) resultTiles.get(0).get("isTemplate"));
    }

    @Test
    void filterDrawers_shouldReturnDrawerWithEntityTileAndMatchingSubject() {
        Map<String, Object> tile = new HashMap<>();
        tile.put("isTemplate", false);
        tile.put("entity", new String[] { "entity1" });
        tile.put("subject", "subject1");

        Map<String, Object> drawer = new HashMap<>();
        drawer.put("tiles", List.of(tile));

        Subject subject = new Subject();
        subject.setLongName("subject1");
        subject.setName("subj1");

        Entity entity = new Entity();
        entity.setName("entity1");
        entity.setSubjects(List.of(subject));

        List<Map<String, Object>> drawers = List.of(drawer);
        List<Entity> entities = List.of(entity);

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(1, result.size());
        List<Map<String, Object>> resultTiles = (List<Map<String, Object>>) result.get(0).get("tiles");
        assertEquals(1, resultTiles.size());
        assertEquals("subject1", resultTiles.get(0).get("subject"));
    }

    @Test
    void filterDrawers_shouldReturnDrawerWithEntityTileAndMatchingSubjectByName() {
        Map<String, Object> tile = new HashMap<>();
        tile.put("isTemplate", false);
        tile.put("entity", new String[] { "entity1" });
        tile.put("subject", "subj1");

        Map<String, Object> drawer = new HashMap<>();
        drawer.put("tiles", List.of(tile));

        Subject subject = new Subject();
        subject.setLongName("subject1");
        subject.setName("subj1");

        Entity entity = new Entity();
        entity.setName("entity1");
        entity.setSubjects(List.of(subject));

        List<Map<String, Object>> drawers = List.of(drawer);
        List<Entity> entities = List.of(entity);

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(1, result.size());
        List<Map<String, Object>> resultTiles = (List<Map<String, Object>>) result.get(0).get("tiles");
        assertEquals(1, resultTiles.size());
        assertEquals("subj1", resultTiles.get(0).get("subject"));
    }

    @Test
    void filterDrawers_shouldNotReturnDrawerIfNoTilesRemain() {
        Map<String, Object> tile = new HashMap<>();
        tile.put("isTemplate", false);
        tile.put("entity", new String[] { "entity1" });
        tile.put("subject", "notfound");

        Map<String, Object> drawer = new HashMap<>();
        drawer.put("tiles", List.of(tile));

        Subject subject = new Subject();
        subject.setLongName("subject1");
        subject.setName("subj1");

        Entity entity = new Entity();
        entity.setName("entity1");
        entity.setSubjects(List.of(subject));

        List<Map<String, Object>> drawers = List.of(drawer);
        List<Entity> entities = List.of(entity);

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(0, result.size());
    }

    @Test
    void filterDrawers_shouldHandleMultipleTilesAndDrawers() {
        Map<String, Object> tile1 = new HashMap<>();
        tile1.put("isTemplate", true);

        Map<String, Object> tile2 = new HashMap<>();
        tile2.put("isTemplate", false);
        tile2.put("entity", new String[] { "entity1" });
        tile2.put("subject", "");

        Map<String, Object> drawer1 = new HashMap<>();
        drawer1.put("tiles", List.of(tile1, tile2));

        Entity entity = new Entity();
        entity.setName("entity1");
        entity.setSubjects(Collections.emptyList());

        List<Map<String, Object>> drawers = List.of(drawer1);
        List<Entity> entities = List.of(entity);

        List<Map<String, Object>> result = adminModuleUtil.filterDrawers(drawers, entities);

        assertEquals(1, result.size());
        List<Map<String, Object>> resultTiles = (List<Map<String, Object>>) result.get(0).get("tiles");
        assertEquals(2, resultTiles.size());
    }

}