ARG JDK_BASE_IMAGE

FROM artifactory.global.standardchartered.com/${JDK_BASE_IMAGE}

RUN addgroup --system --gid 3000 ratanrt
RUN adduser --system --home /apps/ratanrt --ingroup ratanrt --uid 1000 ratanrt

WORKDIR /apps/ratanrt

RUN mkdir -p /apps/ratanrt/logs

ARG BUILD_DIR
ARG JAR_FILE

ENV APP_FILE=${JAR_FILE}

COPY ${BUILD_DIR}/* /apps/ratanrt/

RUN chown -R ratanrt:ratanrt /apps/ratanrt
RUN chmod -R 0755 /apps/ratanrt

USER ratanrt

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar ${APP_FILE} ${0} ${@}"]
