How to use

This project is split into two sections. /frontend contains all the React code and /backend contains all the Go code. Both the frontend and backend must be started seperately. I have included bash scripts to run which will install all the dependancies as well as start the service.

The frontend default port is :3000 and the backend default port is :8080. If you for some reason need to change the ports, make sure you change the port in BOTH .env files or else the client and server won't connect.

If you don't have permission to run the bash file, you may need to run:

`$ chmod u+x frontend.sh`
and
`$ chmod u+x backend.sh`

I also purposly uploaded the .env file for the backend and frontend since this is not a production application and it will make your setup much easier. You can access each one in the respective directories.

If you have any issues or questions please email me at matthew.asgari@me.com

Thanks!
