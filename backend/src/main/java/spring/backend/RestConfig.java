package spring.backend;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import spring.backend.employee.Employee;
import spring.backend.order.Order;
import spring.backend.wine.Wine;

/**
 * This class adds ID field to JSON data in API
 */
@Component
public class RestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(Wine.class);
        config.exposeIdsFor(Employee.class);
        //config.exposeIdsFor(User.class);
        config.exposeIdsFor(Order.class);
    }

}