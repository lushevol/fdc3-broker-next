package com.fdc3.memory.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
public class FlywayMigrationConfig {
    static final String MIGRATOR_BEAN_NAME = "memoryFlywayMigrator";

    @Bean
    Flyway memoryFlyway(DataSource dataSource, Environment environment) {
        String locations = environment.getProperty("spring.flyway.locations", "classpath:db/migration");
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(locations)
                .load();
    }

    @Bean(name = MIGRATOR_BEAN_NAME)
    Object memoryFlywayMigrator(Flyway memoryFlyway) {
        memoryFlyway.migrate();
        return new Object();
    }

    @Bean
    static BeanFactoryPostProcessor entityManagerDependsOnMemoryFlyway() {
        return new EntityManagerFactoryDependsOnMemoryFlywayPostProcessor();
    }

    private static final class EntityManagerFactoryDependsOnMemoryFlywayPostProcessor
            implements BeanFactoryPostProcessor {
        @Override
        public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
            if (!beanFactory.containsBeanDefinition("entityManagerFactory")) {
                return;
            }
            AbstractBeanDefinition definition =
                    (AbstractBeanDefinition) beanFactory.getBeanDefinition("entityManagerFactory");
            definition.setDependsOn(MIGRATOR_BEAN_NAME);
        }
    }
}
