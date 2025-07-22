import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Int64 "mo:base/Int64";

actor DBank {
  stable var currentValue: Float = 1000;

  stable var startTime = Time.now();
  Debug.print(debug_show(startTime));

  public func topUp(amount: Float): async Float {
    currentValue += amount;
    Debug.print("topUp called, currentValue = " #Float.toText(currentValue));
    return currentValue;
  };

  public func withdraw(amount: Float): async Float{
    let tempVal: Float = currentValue - amount;
    if(tempVal>=0){
      currentValue -= amount;
    Debug.print("currentValue = " #Float.toText(currentValue));
    return currentValue;
    } else {
      Debug.print("Balance too low for withdrawal");
      return currentValue;
    }
  };

  public shared query func checkBalance(): async Float{
    return currentValue;
  };

  public func compound(){
    let currentTime = Time.now();
    let timeElapsedN = currentTime - startTime;
    if (timeElapsedN <= 0) {
    Debug.print("Compound skipped: non-positive time elapsed");
    return;
  };

    let timeElapsedHours: Float = Float.fromInt(timeElapsedN) / 3_600_000_000_000;

    if (timeElapsedHours >= 1) {
    currentValue := currentValue * (1.01 ** timeElapsedHours);
    startTime := currentTime;
    };
  };
}