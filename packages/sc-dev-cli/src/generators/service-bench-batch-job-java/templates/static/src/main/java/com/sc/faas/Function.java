package com.sc.faas;

import com.sc.devkit.common.job.dto.JobDefinitionStatus;
import com.sc.devkit.common.job.dto.JobDto;
import com.sc.devkit.common.job.dto.JobLogDto;
import com.sc.devkit.common.job.dto.JobStatus;
import com.sc.devkit.common.logging.LogLevel;
import com.sc.devkit.common.logging.LogType;
import com.sc.devkit.common.logging.LogUtil;
import com.sc.faas.dto.ItemDto;
import io.quarkiverse.jberet.runtime.QuarkusJobOperator;
import io.quarkus.funqy.Funq;
import io.quarkus.funqy.knative.events.CloudEvent;
import jakarta.batch.runtime.BatchStatus;
import jakarta.inject.Inject;
import org.jberet.job.model.Job;
import org.jberet.job.model.JobBuilder;
import org.jberet.job.model.StepBuilder;
import org.jberet.runtime.JobExecutionImpl;

import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class Function {
    @Inject
    private QuarkusJobOperator jobOperator;

    private JobDto activeJobHandler(JobDto jobDto) throws InterruptedException {
        Job job = new JobBuilder("FileJob").step(new StepBuilder("FileStep")
                .reader("fileReader")
                .processor("fileProcessor")
                .writer("fileWriter")
                .build()).build();

        long executionId = jobOperator.start(job, new Properties());
        JobExecutionImpl jobExecution = (JobExecutionImpl) jobOperator.getJobExecution(executionId);
        jobExecution.awaitTermination(1, TimeUnit.HOURS);

        List<ItemDto> processedItems = (List<ItemDto>) jobExecution.getStepExecutions().get(0).getPersistentUserData();
        List<JobLogDto> logs = processedItems.stream().map(it -> JobLogDto.builder().description(it.getProcessLog()).build()).collect(Collectors.toUnmodifiableList());

        if (BatchStatus.COMPLETED.equals(jobExecution.getBatchStatus())) {
            return JobDto.builder()
                    .jobId(jobDto.getJobId())
                    .jobDefinitionId(jobDto.getJobDefinitionId())
                    .jobDefinitionStatus(jobDto.getJobDefinitionStatus())
                    .jobStatus(JobStatus.COMPLETED)
                    .result("Row,Result\n1,success")
                    .jobLogs(logs)
                    .build();
        } else {
            return JobDto.builder()
                    .jobId(jobDto.getJobId())
                    .jobDefinitionId(jobDto.getJobDefinitionId())
                    .jobDefinitionStatus(jobDto.getJobDefinitionStatus())
                    .jobStatus(JobStatus.FAILED)
                    .result("Row,Result\n1,failed")
                    .build();
        }
    }

    private JobDto inactiveJobHandler(JobDto jobDto) {
        return JobDto.builder()
                .jobId(jobDto.getJobId())
                .jobDefinitionId(jobDto.getJobDefinitionId())
                .jobDefinitionStatus(jobDto.getJobDefinitionStatus())
                .jobStatus(JobStatus.CANCELLED)
                .result("Job " + jobDto.getJobId() + " is cancelled")
                .build();
    }


    @Funq
    public JobDto handler(CloudEvent<JobDto> event) throws InterruptedException {
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Received event with data: " + event.data() + " type: " + event.type() + " source:" + event.source(), null);
        if (JobDefinitionStatus.ACTIVE.equals(event.data().getJobDefinitionStatus())) {
            return activeJobHandler(event.data());
        } else if (JobDefinitionStatus.SUSPENDED.equals(event.data().getJobDefinitionStatus())) {
            return inactiveJobHandler(event.data());
        } else {
            throw new RuntimeException("Job definition status not recognized: " + event.data().getJobDefinitionStatus());
        }
    }
}
