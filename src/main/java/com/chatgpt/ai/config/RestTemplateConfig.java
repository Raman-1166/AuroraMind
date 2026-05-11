package com.chatgpt.ai.config;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for RestTemplate bean.
 * Uses SimpleClientHttpRequestFactory with explicit timeouts so they are
 * always honoured regardless of Spring Boot auto-configuration.
 *
 * Connect timeout : 10 seconds
 * Read timeout    : 180 seconds  (gemma:2b can be slow on low-RAM machines)
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);   // 10 seconds
        factory.setReadTimeout(180_000);     // 3 minutes — enough for any local model
        return new RestTemplate(factory);
    }
}
