package spring.backend.wine;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="wines")
public class Wine {
    private @Id @GeneratedValue long id;
    private int year;
    private String name;
    private String description;

    // TODO: enums for colour, taste and region???
    private String colour;
    private String taste; // maybe like sweet/dry/semi-sweet etc.
    private String region;

    private double abv;

    private double price;
    private int stockQuantity;

    public Wine(long id, int year, String name, String description, String colour, String taste, String region, double price, double abv, int stockQuantity) {
        this.id = id;
        this.year = year;
        this.name = name;
        this.description = description;
        this.colour = colour;
        this.taste = taste;
        this.region = region;
        this.price = price;
        this.abv = abv;
        this.stockQuantity = stockQuantity;
    }

    public Wine() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public String getTaste() {
        return taste;
    }

    public void setTaste(String taste) {
        this.taste = taste;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getAbv() {
        return abv;
    }

    public void setAbv(double abv) {
        this.abv = abv;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}
