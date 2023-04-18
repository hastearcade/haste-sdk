# Haste Game Security

Since the games on the Haste arcade provide financial payments through the haste leaderboard payouts (hLP) service, there is a stronger incentive for players to cheat. In order to protect non-malicious users and the reputation of the Haste Arcade, the Haste Arcade does require any published games to adhere to certain security standards. As we move forward, the Haste team will continuously update this documentation with further details and provide examples. If you have any questions, please reach out to us on [Discord](https://discord.gg/mqPN8gDF3A).

It is likely impossible to completely defeat any potential malicious user, but we strive to make it as difficult as possible. As Haste Arcade grows, we will be making Security a top priority and providing tools to developers to ensure their games can be trusted.

## High Level Security Requirements

- All games should follow the [authoritative game server model](https://doc.photonengine.com/zh-CN/bolt/current/troubleshooting/authoritative-server-faq). At its core, all validation of a player move and how a player is scored to determine where they fall on the leaderboard should occur server side. Anything on the client should be considered open to the public and easy to manipulate.
- All games should consider how a well developed bot could cheat their game. Artifical Intelligence and Machine Learning are fairly sophisticated these days and can even play [Starcraft](https://sscaitournament.com/) well. While it is unlikely certain AI or ML models could learn quickly enough to beat "fast" games such as the original Haste games, never forget that people are innovative and could beat your game with a simple bot sometimes if you are over looking how someone might do it. Perhaps they write a script that reads the display buffer and look for certain groupings of pixels, or they parse the HTML markup and perform moves based on how the markup is laid out.
- All games use the authentication and authorization SDKs and APIs provided by Haste Arcade. See Authentication section in the SDK [README](./README.md).
- All games should not store client secrets in a nonsecure location. Examples of nonsecure locations would include, but are not limited to:

  - Built in as a static variable within a client side application such as a React SPA. See [this](https://create-react-app.dev/docs/adding-custom-environment-variables/) for more details related to a `create-react-app` example. Note their WARNING at the top with regards to private keys.
  - Committed to a Github repository. If you ever accidentally commit a secret to the repository, you should use the [Developer Portal](https://developer.hastearcade.com) to reset your secrets under your game's details.
  - Written on a sticky note by your computer

  Best practices for client secrets can be found [here](https://blog.gitguardian.com/secrets-api-management/). Some high level examples include:

  - Do not share secrets in messaging platforms such as Slack, Teams, Skype, etc. Instead use an end to end encrypted messaging platform such as Keybase or Signal.
  - As stated above, never store secrets in a git repository
  - Ensure you use different secrets for different environments and do not share secrets between environments.
