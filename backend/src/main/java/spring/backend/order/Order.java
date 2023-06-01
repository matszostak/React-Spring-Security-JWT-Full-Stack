package spring.backend.order;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;
import java.util.Date;

enum OrderStatus {
    ORDERED,
    READY,
    COMPLETED,
    CANCELLED
}

@Entity
@Table(name="orders")
public class Order {
    private @Id @GeneratedValue long id;
    private OrderStatus status;
    private Long userId;
    private Date date;
    private @ElementCollection Set<Long> wineIds;
    private @ElementCollection List<Long> quantities;
    private Float totalPrice;

    public Order(long id, OrderStatus status, Integer userId, Date date, Set<Long> wineIds, List<Long> quantities, Float totalPrice) {
        this.id = id;
        this.status = status;
        this.userId = userId.longValue();
        this.date = date;
        this.wineIds = wineIds;
        this.quantities = quantities;
        this.totalPrice = totalPrice;
    }

    public Order() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Set<Long> getWineIds() {
        return wineIds;
    }

    public void setWineIds(Set<Long> wineIds) {
        this.wineIds = wineIds;
    }
    public List<Long> getQuantities() {
        return quantities;
    }

    public void setQuantities(List<Long> quantities) {
        this.quantities = quantities;
    }

    public Float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Float totalPrice) {
        this.totalPrice = totalPrice;
    }
}

