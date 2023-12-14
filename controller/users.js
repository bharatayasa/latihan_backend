const conection = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.JWT_SECRET

module.exports = {
    register : (req, res) => {
        const {username, name, email, password} = req.body
        const role = 'user'
    
        bcrypt.hash(password, 10, (err, hasehedPassword) => {
            if (err) {
                console.error('error hashing password');
                res.status(500).json({
                    status  : 'error', 
                    massage : 'internal server eror'
                })
            }
    
            const user = {
                username,
                name,
                email,
                password : hasehedPassword,
                role,
            }
    
            conection.query('INSERT INTO users SET ?', user, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        status  : 'error', 
                        massage : 'gagal melakukan register'
                    });
                }
                    res.status(200).json({
                        status  : 'success',
                        massage : 'berhasil melakukan register'
                    });
            })
        })
    }, 

    login : (req, res) => {
        const { username, password } = req.body;
    
        conection.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status  : 'error',
                    message : 'internal server eror'
                });
            }
    
            if (results.length === 0) {
                return res.status(401).json({ 
                    status  : 'error',
                    message : 'Username atau password salah'
                });
            }
    
            const user = results[0];
    
            bcrypt.compare(password, user.password, (errCompare, passwordMatch) => {
    
                if (errCompare) {
                    return res.status(500).json({
                        status  : 'error', 
                        message : 'eror comparing password'
                    });
                }
    
                if (!passwordMatch) {
                    return res.status(401).json({ 
                        status  : 'error', 
                        message : 'Username or password dont match' 
                    });
                }
    
                const payload = {
                    id: user.id,
                    username : user.username,
                    role: user.role,
                };
    
                const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    
                return res.status(200).json({
                    status  : 'success',
                    message : 'User logged successfully',
                    role    : user.role,
                    data    : {
                        accessToken 
                    }
                });
    
            });
        });
    },

    getMe : (req, res) => {
        const userId = req.user.id
    
        conection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user data: ', err);
                return res.status(500).json({ 
                    status  : 'error', 
                    message : 'Internal Server Error' 
                });
            }
            if (results.length === 0) {
                return res.status(404).json({ 
                    status  : 'error', 
                    message : 'Resource not found' 
                });
            }
    
            const user = results[0]
            res.status(200).json({
                status  : 'success',
                message : 'User retrieved',
                data    : {
                    id       : user.id,
                    username : user.username,
                    name     : user.name,
                    email    : user.email,
                    role     : user.role
                }
            })
        })
    },

    getAllUsers : (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status  : 'error', 
                message : 'Permission denied'
            })
        }
    
        conection.query('SELECT * FROM users', (err, results) => {
            if (err) {
                console.error('error fatching user data', err);
                return res.status(500).json({
                    status  : 'error', 
                    massage : 'intsernal server error'
                })
            }
    
            return res.status(200).json({
                status  : 'success', 
                massage : 'users retrieved',
                data    : results
            })
        })
    }, 

    getUserById : (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status  : 'error', 
                message : 'Permission denied'
            })
        }
    
        const userId = req.params.id; 
    
        conection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('error fatching data', err);
                return res.status(500).json({
                    stataus : 'error',
                    massage : 'internal server error'
                })
            }
    
            if (results === 0) {
                console.error('user not found', err);
                return res.status(404).json({
                    status  : 'error', 
                    massage : 'user not found'
                })
            }
    
            res.status(200).json({
                status  : 'success',
                massage : 'User retrieved',
                data    : results[0]
            })
        })
    }, 

    addUser : (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error', 
                message: 'Permission denied'
            });
        }
    
        const { username, name, email, password, role } = req.body;
    
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password', err);
                return res.status(500).json({
                    status: 'error', 
                    message: 'Internal server error'
                });
            }
    
            const newUser = {
                username,
                name,
                email,
                password: hashedPassword,
                role
            };
    
            conection.query('INSERT INTO users SET ?', newUser, (err, results) => {
                if (err) {
                    console.error('Error adding user', err);
                    return res.status(500).json({
                        status: 'error', 
                        message: 'Failed to add user'
                    });
                }
    
                res.status(200).json({
                    status: 'success',
                    message: 'User added successfully',
                    data: {
                        id      : results.insertId,
                        username: newUser.username,
                        name    : newUser.name,
                        email   : newUser.email,
                        role    : newUser.role,
                    }
                });
            });
        });
    }, 

    updateUser : (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error', 
                message: 'Permission denied'
            });
        }
    
        const userId = req.params.id; 
    
        const { username, name, email, role } = req.body;
    
        const userUpdate = {
            username,
            name,
            email,
            role
        };
    
        conection.query('UPDATE users SET ? WHERE id = ?', [userUpdate, userId], (err, results) => {
            if (err) {
                console.error('Error update user', err);
                return res.status(500).json({
                    status: 'error', 
                    message: 'Failed to update user'
                });
            }
    
            res.status(200).json({
                status: 'success',
                message: 'User added successfully',
                data: {
                    id : userId,
                    username,
                    name,
                    email,
                    role
                }
            });
        })
    },

    deleteUser : (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error', 
                message: 'Permission denied'
            });
        }
    
        const userId = req.params.id;
        if (userId === undefined) {
            console.error('Missed user id', err);
            return res.status(400).json({
                status: 'error', 
                message: 'Missed user id'
            });
        }
    
        conection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error deleting user', err);
                return res.status(500).json({
                    status: 'error', 
                    message: 'Internal server error'
                });
            }
    
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    status: 'error', 
                    message: 'User not found'
                });
            }
    
            res.status(200).json({
                status: 'success',
                message: 'User deleted'
            });
        });
    }
}
