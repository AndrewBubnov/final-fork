package ua.com.danit.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.danit.dto.UserModerationResponse;
import ua.com.danit.dto.UserResponse;
import ua.com.danit.entity.User;
import ua.com.danit.service.UserTokensService;
import ua.com.danit.service.UsersService;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UsersController {
  private UsersService usersService;
  private UserTokensService userTokensService;

  @Autowired
  public UsersController(UsersService usersService, UserTokensService userTokensService) {
    this.usersService = usersService;
    this.userTokensService = userTokensService;
  }

  @PutMapping
  public ResponseEntity<UserResponse> putUserProfile(@RequestBody User user, @RequestHeader String authorization) {
    return new ResponseEntity<>(usersService.putUserProfile(user, userTokensService.findUserByAccessToken(authorization)),
        HttpStatus.OK);
  }

  @PutMapping("moderation")
  public ResponseEntity<String> putUserModeration(@RequestBody UserModerationResponse userModerationResponse,
                                                  @RequestHeader String authorization) {
    return new ResponseEntity<>(usersService.putUserModeration(userModerationResponse,
        userTokensService.findUserByAccessToken(authorization)),
        HttpStatus.OK);
  }

  @GetMapping("moderationlist")
  public ResponseEntity<List<UserResponse>> getUserListForModeration (@RequestHeader String authorization) {
    return new ResponseEntity<>(usersService.getUserListForModeration(userTokensService.findUserByAccessToken(authorization)),
        HttpStatus.OK);
  }

}
