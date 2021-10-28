"use strict";

var bcrypt = require("bcryptjs");

const db = require("../config/db");

// Profile
class AccountSQL {
  static getAccountInfo(account_id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM account WHERE account_id = ?;";
      db.query(query, [account_id], (err, data) => {
        if (err) reject(`${err}`);
        else resolve(data[0]);
      });
    });
  }

  static getAccountInfo2() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM account;";
      db.query(query, (err, data) => {
        if (err) reject(`${err}`);
        else resolve(data);
      });
    });
  }

  // Register Account
  static async signUp(account) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO account(account_id, wallet_address, profile_image_path, email, password) VALUES(?, ?, ?, ?, ?);";
      db.query(
        query,
        [
          account.account_id,
          account.wallet_address,
          account.profile_image_path,
          account.email,
          bcrypt.hashSync(account.password, 8),
        ],
        (err) => {
          if (err) reject(`${err}`);
          else resolve({ success: true });
        }
      );
    });
  }
}

module.exports = AccountSQL;
