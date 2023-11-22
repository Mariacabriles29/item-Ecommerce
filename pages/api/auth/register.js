import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await register(req, res);
      break;
  }
};

const register = async (req, res) => {
  try {
    const {
      name,
      last_name,
      phone_number,
      address,
      country_of_residence,
      email,
      password,
      cf_password,
      avatar,
    } = req.body;

    const errMsg = valid(
      name,
      last_name,
      phone_number,
      address,
      country_of_residence,
      email,
      password,
      cf_password
    );

    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await Users.findOne({ email });
    if (user)
      return res.status(400).json({ err: "This email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      name,
      last_name,
      phone_number,
      address,
      country_of_residence,
      email,
      password: passwordHash,
      cf_password,
      avatar,
    });

    await newUser.save();
    res.json({ msg: "Register Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
