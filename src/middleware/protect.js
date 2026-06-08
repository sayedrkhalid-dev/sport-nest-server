// const { auth } = require("../auth");

// const protect = async (req, res, next) => {
//   try {
//     const session = await auth.api.getSession({
//       headers: req.headers,
//     });

//     if (!session?.user?.email) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     req.user = session.user;
//     next();
//   } catch {
//     res.status(401).json({ message: "Authentication failed" });
//   }
// };

// module.exports = protect;