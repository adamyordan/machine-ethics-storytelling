FROM java:8

RUN apt-get update && apt-get install -y build-essential
RUN wget http://xsb.sourceforge.net/downloads/XSB.tar.gz && tar xzf XSB.tar.gz
RUN cd /XSB/build && ./configure && ./makexsb

ADD build/app.jar app.jar
ADD qualm /qualm
ADD logicPrograms /logicPrograms

ENV XSB_PATH /XSB/bin/xsb
ENV QUALM_PATH /qualm
ENV LOGIC_PROGRAMS_PATH /logicPrograms

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 4567
