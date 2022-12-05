import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  console.log(`[Current User] Received Request:`, req.session?.jwt);
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!);
    return res.send({ currentUser: payload });
  } catch (err) {
    console.log(`[Current User] Error:`, err);
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
