
### Making your raspberry ready

#### 1. Setting Up Your WIFI in Raspberry Pi
Check if your wifi is reachable.
Lets say your wifi SSID is : ginsengpower
```bash
$ sudo iwlist wlan0 scan | grep ginsengpower
                    ESSID:"ginsengpower"
```
    
Add your wifi settings to connect 

```bash
$ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```
Sample: 
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
ssid="ginsengpower"
psk="1234567"
}
```
Reinitiate the `wlan0` to make the change effect:
```bash
$ sudo ifconfig wlan0 down
$ sudo ifconfig wlan0 up
```
Check your **ip**:
```bash
$ ifconfig wlan0 | grep inet | grep netmask
inet 192.168.1.104  netmask 255.255.255.0  broadcast 192.168.1.255
```

#### 2. Change Password and SSH
Change Password (importent):
```bash
$ sudo passwd pi
Enter new UNIX password: *******
Retype new UNIX password: *******
passwd: password updated successfully
```

From a different machine, `ssh` to your raspberry with the **ip** and your new password
```
$ ssh pi@192.168.1.104
pi@192.168.1.104's password: *******
....
pi@raspberrypi:~ $
pi@raspberrypi:~ $ ifconfig wlan0 | grep inet | grep netmask
        inet 192.168.1.104  netmask 255.255.255.0  broadcast 192.168.1.255
```


#### 2. Install few prerequisites 

##### VIM
```
$ sudo apt-get install -y vim
```
##### GIT
```
$ sudo apt-get install -y git
```
##### Docker
This below step install docker for arm low capacity device: 
```
$ curl -sSL https://get.docker.com | sh
```
   
Add current user to docker group. 
```
$ echo $USER
pi
$ sudo usermod pi -aG docker
```
Reboot. 
```
$ sudo reboot
```
After the reboot is complete ssh again.  

##### Init the swarm-cluster
```bash
$ docker swarm init
$ docker node ls
```

#### 3: Create a ngrok account to get a public url
goto [https://ngrok.com](https://ngrok.com)
Create a account and save the `authtoken` 

#### 4. Start the platform
Clone the repo
```bash
$ git clone https://github.com/s8sg/daily_iot.git
$ cd daily_iot
```
Change the Conf
```bash
$ vim platform.conf
```
below is a sample one
```
ngrok: 1
ngrok_token: asd78612371hjasdh17263hbasjdhg7128
gateway_port: 8080
service: {
  read_todo: 1
}
```
Bringup the platform
```bash
$ ./init.sh
```
