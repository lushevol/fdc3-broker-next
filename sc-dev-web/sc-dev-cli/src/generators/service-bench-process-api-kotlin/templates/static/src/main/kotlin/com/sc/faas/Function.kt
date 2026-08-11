package com.sc.faas;

import com.sc.faas.dto.MyObject
import com.sc.faas.service.ProcessService
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/api/process/v1/")
class Function {

    @Inject
    private lateinit var processService: ProcessService;

    /**
     * exposed REST GET api at /api/process/v1/objects/{id}
     */
    @Path("/objects/{id}")
    @GET
    fun getObjectById(@PathParam("id") id: Long): MyObject {
        return processService.getObjectById(id)
    }
}
