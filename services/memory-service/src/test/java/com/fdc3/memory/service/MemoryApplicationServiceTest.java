package com.fdc3.memory.service;

import com.fdc3.memory.domain.MemoryEntry;
import com.fdc3.memory.domain.MemorySource;
import com.fdc3.memory.domain.MemoryStatus;
import com.fdc3.memory.domain.MemoryType;
import com.fdc3.memory.repository.MemoryEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.datasource.url=jdbc:sqlite:target/memory-service-test.sqlite")
class MemoryApplicationServiceTest {

    @Autowired
    private MemoryApplicationService memoryService;

    @Autowired
    private MemoryEntryRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void createDefaultsOperatorMemoryFields() {
        MemoryEntry created = memoryService.create(
                new MemoryScope("tenant-a", "operator-1", "rates"),
                new MemoryApplicationService.CreateMemoryCommand(
                        MemoryType.PREFERENCE,
                        "Morning summary",
                        "Prefers concise morning summaries grouped by Rates, FX, and Credit.",
                        List.of("morning", "format"),
                        null,
                        null,
                        "{}"
                )
        );

        assertThat(created.getId()).isNotBlank();
        assertThat(created.getStatus()).isEqualTo(MemoryStatus.ACTIVE);
        assertThat(created.getSource()).isEqualTo(MemorySource.USER);
        assertThat(created.getConfidence()).isEqualByComparingTo(BigDecimal.ONE);
        assertThat(created.getSchemaVersion()).isEqualTo(1);
        assertThat(created.getTenantId()).isEqualTo("tenant-a");
        assertThat(created.getUserId()).isEqualTo("operator-1");
    }

    @Test
    void searchOnlyReturnsSameTenantAndUser() {
        memoryService.create(
                new MemoryScope("tenant-a", "operator-1", "rates"),
                new MemoryApplicationService.CreateMemoryCommand(
                        MemoryType.BAU_WORKFLOW,
                        "Morning BAU",
                        "Checks USD rates blotter and failed trades first.",
                        List.of("bau"),
                        MemorySource.USER,
                        BigDecimal.ONE,
                        "{}"
                )
        );
        memoryService.create(
                new MemoryScope("tenant-a", "operator-2", "rates"),
                new MemoryApplicationService.CreateMemoryCommand(
                        MemoryType.BAU_WORKFLOW,
                        "Other BAU",
                        "Should not be visible.",
                        List.of("bau"),
                        MemorySource.USER,
                        BigDecimal.ONE,
                        "{}"
                )
        );

        List<MemoryEntry> results = memoryService.search(
                new MemoryScope("tenant-a", "operator-1", null),
                new MemoryApplicationService.SearchMemoryQuery(MemoryType.BAU_WORKFLOW, "rates", null, MemoryStatus.ACTIVE, 20)
        );

        assertThat(results).extracting(MemoryEntry::getTitle).containsExactly("Morning BAU");
    }

    @Test
    void archiveAndDeleteAreStatusChanges() {
        MemoryScope scope = new MemoryScope("tenant-a", "operator-1", "rates");
        MemoryEntry created = memoryService.create(
                scope,
                new MemoryApplicationService.CreateMemoryCommand(
                        MemoryType.NOTE,
                        "Escalation",
                        "Escalates settlement breaks over ten million.",
                        List.of("settlement"),
                        MemorySource.USER,
                        BigDecimal.ONE,
                        "{}"
                )
        );

        MemoryEntry archived = memoryService.archive(scope, created.getId());
        assertThat(archived.getStatus()).isEqualTo(MemoryStatus.ARCHIVED);

        memoryService.softDelete(scope, created.getId());
        assertThat(repository.findById(created.getId())).get().extracting(MemoryEntry::getStatus)
                .isEqualTo(MemoryStatus.DELETED);
    }
}
