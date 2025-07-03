/*
      connect description
      JoyStick Shield               Arduino UNO
      Buttuon A                       D2
      Buttuon B                       D3
      Buttuon C                       D4
      Buttuon D                       D5
      Buttuon E                       D6
      Buttuon F                       D7
      Buttuon K                       D8
      X                               A0
      Y                               A1
*/
const int DEVICE_ID = 2; // †ハードコーディング†

int initialStickX, initialStickY;
const unsigned int BAUD_RATE = 9600;

bool currentButtonState[9]; // false: Not pressed, true: Pressed
bool lastButtonState[9]; // false: Not pressed, true: Pressed
unsigned long lastDebounceTime[9];
const unsigned long DEBOUNCE_DELAY = 50; // Wait 50ms to confirm stable button state

const int ANALOG_X_PIN = A0;
const int ANALOG_Y_PIN = A1;
const int STICK_DEADZONE = 100;
byte lastDirection;

// direction bit
enum DirectionBits {
  DIR_UP    = 0b1000,
  DIR_DOWN  = 0b0100,
  DIR_LEFT  = 0b0010,
  DIR_RIGHT = 0b0001
};

char buf[64];
//const char* buttonChars[9] = { "", "", "A", "B", "C", "D", "E", "F", "KEY" };

void setup() {
  for (int i = 0; i < 19; i++) {
    pinMode(i, INPUT_PULLUP);
    digitalWrite(i, HIGH);
  }
  Serial.begin(BAUD_RATE);

  unsigned long currentMillis = millis();
  for (int i = 0; i < 9; ++i) {
    currentButtonState[i] = false;
    lastButtonState[i] = false;
    lastDebounceTime[i] = currentMillis;
  }


  delay(100);
  initialStickX = analogRead(A0);
  initialStickY = analogRead(A1);

  lastDirection = 0;
//  sprintf(buf, "initialStickX = %d", initialStickX);
//  Serial.println(buf);
//  sprintf(buf, "initialStickX = %d", initialStickX);
//  Serial.println(buf);
}

void loop() {
  unsigned long currentMillis = millis();

  for (int i = 2; i < 9; ++i) {
    bool isPressed = !digitalRead(i);
    if (isPressed != lastButtonState[i]) {
      lastDebounceTime[i] = currentMillis;
    }
    if (currentMillis - lastDebounceTime[i] > DEBOUNCE_DELAY) {
      if (isPressed != currentButtonState[i]) {
        sendButtonUpdate(i, isPressed ? 1 : 0);
        currentButtonState[i] = isPressed;
//        sprintf(buf, "---> Button %s %s !", buttonChars[i], isPressed ? "pressed" : "released");
//        Serial.println(buf); 
      }
    }
    lastButtonState[i] = isPressed;
  }
  
  int sensorValue = analogRead(A0);
  int stickX = analogRead(ANALOG_X_PIN) - initialStickX;
  int stickY = analogRead(ANALOG_Y_PIN) - initialStickY;
  byte direction = 0;
  if (stickX > STICK_DEADZONE) {
    direction |= DIR_RIGHT;
  }
  else if (stickX < -STICK_DEADZONE) {
    direction |= DIR_LEFT;
  }
  
  if (stickY > STICK_DEADZONE) {
    direction |= DIR_UP;
  } else if (stickY < -STICK_DEADZONE) {
    direction |= DIR_DOWN;
  }

  if (lastDirection != direction) {
    for (int i = 0; i < 4; ++i) {
      if (!(lastDirection >> i & 1) && (direction >> i & 1)) {
        sendStickUpdate(i);
      }
    }
    lastDirection = direction;
  }

//  printDirection(direction);
//  sprintf(buf, "X = %d", stickX);
//  Serial.println(buf);
//  sprintf(buf, "Y = %d", stickY);
//  Serial.println(buf);
}


// direction: up(1) right(2) down(3) left(4)
void sendStickUpdate(int direction) {
  sprintf(buf, "%d,1,%d", DEVICE_ID, direction); // e.g., 1,1,2
  Serial.println(buf);
}

void sendButtonUpdate(int button, int isPressed) {
  sprintf(buf, "%d,2,%d,%d", DEVICE_ID, button, isPressed); // e.g., 1,2,1,1
  Serial.println(buf);
}

void printDirection(byte dir) {
  switch (dir) {
    case DIR_UP: Serial.println("↑"); break;
    case DIR_UP | DIR_RIGHT: Serial.println("↗"); break;
    case DIR_RIGHT: Serial.println("→"); break;
    case DIR_DOWN | DIR_RIGHT: Serial.println("↘"); break;
    case DIR_DOWN: Serial.println("↓"); break;
    case DIR_DOWN | DIR_LEFT: Serial.println("↙"); break;
    case DIR_LEFT: Serial.println("←"); break;
    case DIR_UP | DIR_LEFT: Serial.println("↖"); break;
    default: Serial.println("・"); break;
  }
}
