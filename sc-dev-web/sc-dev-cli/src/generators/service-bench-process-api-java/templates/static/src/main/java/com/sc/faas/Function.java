package com.sc.faas;

import com.sc.faas.service.ProcessService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/api/experience/v1/")
public class Function {

    @Inject
    private ProcessService processService;

    /**
     * exposed REST GET api at /api/experience/v1/objects/{id}
     */
    @Path("/objects/{id}")
    @GET
    public Object getObjectById(@PathParam("id") Long id) {
        return processService.getObjectById(id);
    }
}
