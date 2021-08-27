import React from "react";
import { useHasteState } from "./HasteContext";
import { HasteClient } from "@hastearcade/web";

const login = async (client: HasteClient) => {
  await client.loginWithRedirect();
};

function Main() {
  const hasteState = useHasteState();

  return (
    <div>
      <input
        type="button"
        className="App-link"
        onClick={() => {
          if (hasteState.hasteClient) {
            console.log("here2");
            login(hasteState.hasteClient);
          }
        }}
        value={"Login"}
      />
    </div>
  );
}

export default Main;
