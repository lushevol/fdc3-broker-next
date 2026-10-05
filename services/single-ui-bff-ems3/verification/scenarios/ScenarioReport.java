import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.scb.sso.singleuibff.dto.ems2.v2.*;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
import com.scb.sso.singleuibff.repository.AuthorizationApplicationRepo;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.implementation.RoutingAuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.orm.jpa.SharedEntityManagerCreator;

import java.net.ServerSocket;
import java.nio.file.*;
import java.sql.*;
import java.util.*;

/** Replays sanitized dump records through the actual query, router and tile filter. */
public class ScenarioReport {
    static final ObjectMapper JSON = new ObjectMapper();
    static final String SCHEMA = "post_trade_portal_service";
    static final String USER = "scenario_report";
    static Path cluster;
    static String url;
    static SessionFactory sessions;
    static final List<Map<String, String>> ROLES = List.of(
        Map.of("entityName", "X_RATANONE", "roleName", "FMO_COO_SUP"),
        Map.of("entityName", "X_RATANONE", "roleName", "FMO_KR_OPS"),
        Map.of("entityName", "FMO PORTAL ADMIN", "roleName", "FMO_ADMIN"));

    public static void main(String[] args) throws Exception {
        var data = JSON.readTree(Path.of(args[0]).toFile());
        try {
            start();
            createAndLoad(data);
            sql(Files.readString(Path.of(args[1])));
            var registry = new StandardServiceRegistryBuilder()
                .applySetting("hibernate.connection.url", url + "?currentSchema=" + SCHEMA)
                .applySetting("hibernate.connection.username", USER)
                .applySetting("hibernate.connection.password", "")
                .applySetting("hibernate.hbm2ddl.auto", "validate")
                .applySetting("hibernate.physical_naming_strategy", "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy")
                .build();
            sessions = new MetadataSources(registry).addAnnotatedClass(AuthorizationApplication.class)
                .buildMetadata().buildSessionFactory();
            var repository = new JpaRepositoryFactory(SharedEntityManagerCreator.createSharedEntityManager(sessions))
                .getRepository(AuthorizationApplicationRepo.class);
            String query = ApplicationCategoryRepo.class.getMethod("getDrawers").getAnnotation(Query.class).value();
            var rows = query(query);
            var filter = new AdminModuleUtil(null, JSON, null, null);
            var scope = filter.getEntityFromApplicationCategory(rows);
            List<Integer> expected = JSON.convertValue(data.get("candidateTileIds"), new TypeReference<>() {});
            require(new TreeSet<>(rows.stream().map(row -> ((Number) row.get("application_tile_id")).intValue()).toList()).equals(new TreeSet<>(expected)),
                "SQL candidates differ from independent CSV replay");
            var report = new LinkedHashMap<String, Object>();
            report.put("evidence", "Actual PostgreSQL query, actual mapping migration/JPA router and actual AdminModuleUtil; normalized provider fixtures, no browser/live EMS");
            report.put("catalogueRows", rows.size());
            report.put("requestedEntityCount", scope.size());
            report.put("mappingRowCount", scalar("SELECT count(*) FROM " + SCHEMA + ".authorization_application"));
            report.put("candidateTileIds", expected);
            report.put("templates", data.get("templateCandidateTileIds"));
            var combinations = new ArrayList<Map<String, Object>>();
            for (int mask = 0; mask < 8; mask++) {
                var assigned = new ArrayList<Map<String, String>>();
                for (int bit = 0; bit < ROLES.size(); bit++) if ((mask & (1 << bit)) != 0) assigned.add(ROLES.get(bit));
                List<Long> baseline = null;
                for (String pattern : List.of("EMS2/EMS2", "EMS2/EMS3", "EMS3/EMS2", "EMS3/EMS3", "ALL_EMS3")) {
                    configure(pattern);
                    var calls = new LinkedHashMap<String, List<List<String>>>();
                    calls.put("EMS2", new ArrayList<>());
                    calls.put("EMS3", new ArrayList<>());
                    AuthorizationService legacy = (user, entities) -> {
                        calls.get("EMS2").add(List.copyOf(entities));
                        var normalized = result(data, assigned, entities); normalized.setAccountName(user); return normalized;
                    };
                    var router = new RoutingAuthorizationService(repository, legacy, (user, applications) -> {
                        var entities = applications.stream().map(AuthorizationApplication::getBffEntityName).toList();
                        calls.get("EMS3").add(entities);
                        var normalized = result(data, assigned, entities); normalized.setAccountName(user); return normalized;
                    });
                    var grants = router.getEntitlements("synthetic-user-" + mask, scope).getEntities();
                    var drawers = filter.getDrawer(rows, grants);
                    var ids = visible(drawers);
                    if (baseline == null) baseline = ids;
                    require(baseline.equals(ids), "Provider selection changed visibility for mask " + mask);
                    if (pattern.equals("ALL_EMS3")) require(calls.get("EMS2").isEmpty(), "All-EMS3 called EMS2");
                    if (pattern.equals("EMS2/EMS2")) require(calls.get("EMS3").isEmpty(), "All-EMS2 called EMS3");
                    var chosen = repository.findByBffEntityNameIn(List.of("X_RATANONE", "FMO PORTAL ADMIN"));
                    var entry = new LinkedHashMap<String, Object>();
                    entry.put("roleMask", mask);
                    entry.put("roles", assigned);
                    entry.put("providers", pattern);
                    entry.put("visibleTileIds", ids);
                    entry.put("visibleCategories", drawers.stream().map(drawer -> Map.of("id", drawer.get("id"),
                        "label", drawer.get("label"), "tileIds", visible(List.of(drawer)))).toList());
                    entry.put("providerCalls", Map.of("EMS2", calls.get("EMS2").size(), "EMS3", calls.get("EMS3").size()));
                    entry.put("providerScopeSizes", Map.of("EMS2", calls.get("EMS2").stream().map(List::size).toList(),
                        "EMS3", calls.get("EMS3").stream().map(List::size).toList()));
                    entry.put("routeRecords", chosen.stream().map(route -> Map.of("id", route.getId(), "entity", route.getBffEntityName(),
                        "provider", route.getProvider(), "version", route.getMappingVersion())).toList());
                    combinations.add(entry);
                }
            }
            report.put("combinations", combinations);
            var roleCases = new ArrayList<Map<String, Object>>();
            for (JsonNode entity : data.get("xmlCatalogs")) {
                var names = new TreeSet<String>();
                entity.get("grants").forEach(grant -> names.add(grant.get("roleName").asText()));
                for (String name : names) {
                    var assigned = List.of(Map.of("entityName", entity.get("entityName").asText(), "roleName", name));
                    var grants = result(data, assigned, scope).getEntities();
                    roleCases.add(Map.of("entityName", entity.get("entityName").asText(), "roleName", name,
                        "visibleTileIds", visible(filter.getDrawer(rows, grants))));
                }
            }
            report.put("singleRoleCases", roleCases);
            require(roleCases.size() == data.get("singleRolePredictions").size(), "Role case count mismatch");
            for (int i = 0; i < roleCases.size(); i++) {
                var actual = roleCases.get(i);
                JsonNode prediction = null;
                for (var candidate : data.get("singleRolePredictions")) {
                    if (actual.get("entityName").equals(candidate.get("entityName").asText())
                        && actual.get("roleName").equals(candidate.get("roleName").asText())) prediction = candidate;
                }
                require(prediction != null, "Role prediction missing");
                var predictedIds = new TreeSet<Long>();
                prediction.get("visibleTileIds").forEach(id -> predictedIds.add(id.asLong()));
                List<Long> actualIds = JSON.convertValue(actual.get("visibleTileIds"), new TypeReference<>() {});
                require(new TreeSet<>(actualIds).equals(predictedIds), "Role visibility mismatch");
            }
            JSON.writerWithDefaultPrettyPrinter().writeValue(Path.of(args[2]).toFile(), report);
            System.out.println("PASS: " + rows.size() + " catalogue rows; " + scope.size() + " requested entities; "
                + combinations.size() + " role/provider combinations; " + roleCases.size() + " individual exported roles");
        } finally {
            if (sessions != null) sessions.close();
            if (cluster != null && Files.exists(cluster.resolve("data/postmaster.pid"))) pg("pg_ctl", "-D", cluster.resolve("data").toString(), "-m", "immediate", "-w", "stop");
        }
    }

    static void configure(String pattern) throws Exception {
        sql("UPDATE " + SCHEMA + ".authorization_application SET provider = 'EMS2'");
        if (pattern.equals("ALL_EMS3")) sql("UPDATE " + SCHEMA + ".authorization_application SET provider='EMS3', bff_entity_id=id, ems3_app_name=bff_entity_name, ems3_app_id='synthetic-app-'||id, ems3_app_uid=id, ems3_itam_id='synthetic-itam-'||id");
        for (var entry : List.of(Map.entry("X_RATANONE", 1L), Map.entry("FMO PORTAL ADMIN", 2L))) {
            boolean modern = pattern.equals("ALL_EMS3") || pattern.split("/")[entry.getValue().intValue() - 1].equals("EMS3");
            if (modern) {
                try (var connection = connect(); var statement = connection.prepareStatement("UPDATE " + SCHEMA + ".authorization_application SET provider='EMS3', bff_entity_id=?, ems3_app_name=bff_entity_name, ems3_app_id='synthetic-app-'||id, ems3_app_uid=id, ems3_itam_id='synthetic-itam-'||id WHERE bff_entity_name=?")) {
                    statement.setLong(1, entry.getValue()); statement.setString(2, entry.getKey()); statement.executeUpdate();
                }
            }
        }
    }

    static Ems2Result result(JsonNode data, List<Map<String, String>> assigned, List<String> scope) {
        var entities = new ArrayList<Entity>();
        for (var assignment : assigned) {
            if (!scope.contains(assignment.get("entityName"))) continue;
            var entity = new Entity();
            entity.setId(assignment.get("entityName").equals("X_RATANONE") ? 1L : assignment.get("entityName").equals("FMO PORTAL ADMIN") ? 2L : 3L);
            entity.setName(assignment.get("entityName"));
            entity.setApplicationName(assignment.get("entityName"));
            entity.setRoleName(assignment.get("roleName"));
            var subjects = new LinkedHashMap<String, Subject>();
            for (JsonNode catalog : data.get("xmlCatalogs")) {
                if (!catalog.get("entityName").asText().equals(entity.getName())) continue;
                for (JsonNode grant : catalog.get("grants")) {
                    if (!grant.get("roleName").asText().equals(entity.getRoleName())) continue;
                    var subject = subjects.computeIfAbsent(grant.get("subject").asText(), name -> {
                        var value = new Subject(); value.setName(name); value.setLongName(grant.get("longName").asText());
                        value.setActions(new ArrayList<>()); return value;
                    });
                    if (subject.getActions().stream().noneMatch(action -> action.getName().equals(grant.get("action").asText()))) {
                        var action = new Action(); action.setName(grant.get("action").asText()); subject.getActions().add(action);
                    }
                }
            }
            entity.setSubjects(List.copyOf(subjects.values())); entities.add(entity);
        }
        var result = new Ems2Result(); result.setEntities(entities); result.setStatus("SUCCESS"); return result;
    }

    static List<Long> visible(List<Map<String, Object>> drawers) {
        return drawers.stream().flatMap(drawer -> JSON.convertValue(drawer.get("tiles"), new TypeReference<List<Map<String, Object>>>() {}).stream())
            .map(tile -> ((Number) tile.get("id")).longValue()).sorted().toList();
    }

    static void createAndLoad(JsonNode data) throws Exception {
        sql("CREATE SCHEMA " + SCHEMA);
        sql("CREATE TABLE " + SCHEMA + ".application_category (application_category_id bigint, label text, is_active boolean, order_no bigint)");
        sql("CREATE TABLE " + SCHEMA + ".import_map (import_map_id bigint, key_name text, is_active boolean)");
        sql("CREATE TABLE " + SCHEMA + ".application_tile (application_tile_id bigint, application_category_id bigint, import_map_id bigint, is_active boolean, is_template boolean, ems2_entities text, ems2_subject text, module text, tile text, title text, subtitle text, image_dark_theme text, image_light_theme text, email_support text, order_no bigint)");
        load("application_category", data.get("categories"), "application_category_id,label,is_active,order_no");
        load("import_map", data.get("importMaps"), "import_map_id,key_name,is_active");
        load("application_tile", data.get("tiles"), "application_tile_id,application_category_id,import_map_id,is_active,is_template,ems2_entities,ems2_subject,module,tile,title,subtitle,image_dark_theme,image_light_theme,email_support,order_no");
    }

    static void load(String table, JsonNode rows, String columns) throws Exception {
        var names = columns.split(",");
        try (var connection = connect(); var statement = connection.prepareStatement("INSERT INTO " + SCHEMA + "." + table + " (" + columns + ") VALUES (" + String.join(",", Collections.nCopies(names.length, "?")) + ")")) {
            for (var row : rows) {
                for (int i = 0; i < names.length; i++) {
                    var value = row.get(names[i]);
                    statement.setObject(i + 1, value == null || value.isNull() ? null : value.isBoolean() ? value.asBoolean() : value.isIntegralNumber() ? value.asLong() : value.asText());
                }
                statement.addBatch();
            }
            statement.executeBatch();
        }
    }

    static List<Map<String, Object>> query(String query) throws Exception {
        try (var connection = connect(); var statement = connection.createStatement(); var result = statement.executeQuery(query)) {
            var rows = new ArrayList<Map<String, Object>>();
            var metadata = result.getMetaData();
            while (result.next()) {
                var row = new LinkedHashMap<String, Object>();
                for (int i = 1; i <= metadata.getColumnCount(); i++) row.put(metadata.getColumnLabel(i), result.getObject(i));
                rows.add(row);
            }
            return rows;
        }
    }

    static long scalar(String query) throws Exception { return ((Number) query(query).get(0).values().iterator().next()).longValue(); }
    static Connection connect() throws Exception { return DriverManager.getConnection(url + "?currentSchema=" + SCHEMA, USER, ""); }
    static void sql(String sql) throws Exception { try (var connection = connect(); var statement = connection.createStatement()) { statement.execute(sql); } }
    static void require(boolean condition, String reason) { if (!condition) throw new AssertionError(reason); }
    static void start() throws Exception {
        cluster = Files.createTempDirectory(Path.of("/tmp"), "ems3-scenario-");
        int port; try (var socket = new ServerSocket(0)) { port = socket.getLocalPort(); }
        pg("initdb", "-D", cluster.resolve("data").toString(), "-U", USER, "--auth-local=trust", "--auth-host=trust", "--no-locale", "--encoding=UTF8");
        pg("pg_ctl", "-D", cluster.resolve("data").toString(), "-l", cluster.resolve("server.log").toString(), "-o", "-h 127.0.0.1 -p " + port + " -k " + cluster, "-w", "start");
        url = "jdbc:postgresql://127.0.0.1:" + port + "/postgres";
    }
    static void pg(String command, String... args) throws Exception {
        var invocation = new ArrayList<String>();
        invocation.add(Path.of(System.getProperty("bff.verify.postgres.bin", "/opt/homebrew/opt/postgresql@18/bin"), command).toString());
        invocation.addAll(List.of(args));
        var process = new ProcessBuilder(invocation).redirectErrorStream(true).redirectOutput(ProcessBuilder.Redirect.appendTo(cluster.resolve("commands.log").toFile())).start();
        if (!process.waitFor(30, java.util.concurrent.TimeUnit.SECONDS)) { process.destroyForcibly(); throw new IllegalStateException(command + " timed out"); }
        require(process.exitValue() == 0, command + " failed; see " + cluster);
    }
}
