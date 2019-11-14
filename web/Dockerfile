FROM ubuntu:18.04
USER root

RUN apt update
RUN apt upgrade

RUN apt-get -y install sudo

RUN sudo apt-get -y install curl

RUN sudo apt-get -y install nginx

COPY ./html /var/www/html
# COPY ./conf.bak /etc/nginx

RUN sudo update-rc.d nginx enable
RUN sudo /etc/init.d/nginx start
RUN sudo service nginx start

EXPOSE 80

CMD ["/bin/bash"]