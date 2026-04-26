package com.fdc3.elasticsearchmcp.catalog;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class Text2SqlCatalogService {

    private final List<Text2SqlModule> modules;

    public Text2SqlCatalogService() {
        this(List.of(new FunctionUsageText2SqlModule()));
    }

    @Autowired
    public Text2SqlCatalogService(List<Text2SqlModule> modules) {
        this.modules = List.copyOf(modules);
    }

    public Text2SqlCatalog catalog() {
        return new Text2SqlCatalog(modules.stream()
                .flatMap(module -> module.datasets().stream())
                .toList());
    }

    public String renderCatalog() {
        return catalog().render();
    }
}
