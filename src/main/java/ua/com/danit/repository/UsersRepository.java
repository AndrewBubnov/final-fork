package ua.com.danit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ua.com.danit.entity.User;

import javax.transaction.Transactional;
import java.util.List;

public interface UsersRepository extends JpaRepository<User, Long> {

  List<User> findByUserPhone(String userPhone);

  List<User> findByUserMail(String userMail);

  @Modifying(clearAutomatically = true)
  @Transactional
  @Query(value =
      "UPDATE Users SET user_Is_Ok_User_Photo = ?2, user_Is_Ok_Car_Photo = ?3"
          + " WHERE user_Id = ?1", nativeQuery = true)
  void putUserModeration(Long userId, Integer userIsOkUserPhoto, Integer userIsOkCarPhoto);

  @Query(value = "SELECT * FROM users "
      + " WHERE (COALESCE(user_is_ok_user_photo,0)<> 1"
      + " or COALESCE(user_is_ok_car_photo,0) <> 1) LIMIT 10;", nativeQuery = true)
  List<User> getUserListForModeration();

}
