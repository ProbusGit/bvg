import { ImageRequireSource } from 'react-native';
import images from './asset/images';

interface GreetingData {
  message: string;
  image: string;
  profileImage:ImageRequireSource
}

function greetUser(): GreetingData {
  const {morning, afternoon, evening, night} = images;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting: string;
  let image: string;

  if (currentHour < 5) {
    greeting = 'Good evening!';
    image = night;
  } else if (currentHour < 12) {
    greeting = 'Good morning!';
    image = morning;
  } else if (currentHour < 18) {
    greeting = 'Good afternoon!';
    image = afternoon;
  } else {
    greeting = 'Good evening!';
    image = evening;
  }

  return {message: greeting, image,profileImage:images.userProfile};
}

export default greetUser;
