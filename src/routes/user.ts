
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/:userId', (req: Request, res: Response) => {
    res.send('getUser');
});

router.put('/:userId', (req: Request, res: Response) => {
    res.send('update user');
});

router.delete('/:userId', (req: Request, res: Response) => {
    res.send('delete user');
});

module.exports = router;