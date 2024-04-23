**Rajapinnasta testataan käyttäjän luonti, käyttäjän kirjautuminen ja käyttäjän poistaminen**

run npm i chai mocha chai-http to install necessary packages.

**LOGIN**


app.post("/login", async (req, res) => {

  const { username, password } = req.body;


      res.status(200).json({ token: token });
      res.status(401).json({ message: "Invalid credentials!" });
    res.status(500).json({ message: "Internal server error" });
**REGISTER**

app.post("/register", async (req, res) => {

		const { username, password } = req.body;
		try {
		const existingUser = await pgPool.query(
		"SELECT * FROM accounts WHERE username = $1",
		[username]
    );

		if (existingUser.rowCount > 0) {
      	return res.status(400).json({ message: "Username already exists" });
    	}

		    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pgPool.query(
      "INSERT INTO accounts (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(500).json({ message: "Internal server error" });

**REMOVE**
