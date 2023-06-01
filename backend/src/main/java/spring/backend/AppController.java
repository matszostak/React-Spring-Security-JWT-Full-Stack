package spring.backend;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.backend.config.UserAuthenticationProvider;
import spring.backend.dtos.CredentialsDto;
import spring.backend.dtos.SignUpDto;
import spring.backend.dtos.UserDto;
import spring.backend.services.UserService;
import spring.backend.wine.Wine;
import spring.backend.wine.WineRepository;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AppController {

    private final UserService userService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @Autowired
    private WineRepository wineRepository;
    @RequestMapping(value = "/")
    public String index() {
        return "<a href=\"/api/\">API</a>";
    }

    @GetMapping("/api/randomwines")
    public ResponseEntity<List<Wine>> randomWines() {
        try {
            int randomItems = 5;
            List<Wine> randomWines = wineRepository.findAll();

            Collections.shuffle(randomWines);
            randomWines = (randomItems > randomWines.size() ? randomWines.subList(0, randomWines.size()) : randomWines.subList(0, randomItems));

            if (randomWines.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(randomWines, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        UserDto userDto = userService.login(credentialsDto);
        userDto.setToken(userAuthenticationProvider.createToken(userDto.getLogin()));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto user) {
        UserDto createdUser = userService.register(user);
        createdUser.setRole("ROLE_USER");
        createdUser.setToken(userAuthenticationProvider.createToken(user.getLogin()));
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }


    @RequestMapping(
            value = {"/api/removeWineStock"},
            method = RequestMethod.POST,
            consumes = "application/json"
    )
    public void removeWineStock(@RequestBody ChangeStockRequest request){
        Wine wine = wineRepository.getReferenceById(request.id);
        int stock = wine.getStockQuantity();
        wine.setStockQuantity(stock - request.count);
        wineRepository.saveAndFlush(wine);
    }


    @RequestMapping(
            value = {"/api/addWineStock"},
            method = RequestMethod.POST,
            consumes = "application/json"
    )
    public void addWineStock(@RequestBody ChangeStockRequest request){
        Wine wine = wineRepository.getReferenceById(request.id);
        int stock = wine.getStockQuantity();
        wine.setStockQuantity(stock + request.count);
        wineRepository.saveAndFlush(wine);
    }


}