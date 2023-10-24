import { config } from "dotenv";
import { exec } from "child_process";

config();

const {
  SSH_HOST,
  SSH_USER,
  SSH_PEM_FILENAME,
  DB_HOST,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
} = process.env;
const canRun = {
  backup: true,
};

exec(
  `touch /root/.ssh/known_hosts && ssh-keyscan ${SSH_HOST} >> /root/.ssh/known_hosts && ssh -i pems/${SSH_PEM_FILENAME} -N ${SSH_USER}@${SSH_HOST} -L ${DB_PORT}:${DB_HOST}:${DB_PORT}`,
  (err, stdout, stderr) => {
    canRun.backup = false;
    if (err) {
      console.log(err);
    }
  }
);

setTimeout(() => {
  if (canRun.backup) {
    exec(
      `PGPASSWORD=\"${DB_PASSWORD}\" pg_dump -h 127.0.0.1 -p ${DB_PORT} -U ${DB_USER} -d ${DB_DATABASE} -w -F c -f backups/$(date +'%Y-%m-%d-%H-%M-%S').backup -v`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
        }
        console.log(stdout);
      }
    );
  } else {
    console.log("Could not connect to remote server");
  }
}, 5000);
