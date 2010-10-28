# Makefile for cgilib.a

# macros and variables
CC= gcc
CFLAGS= -g -Wall -DUNIX -I../include #-DUPLOADDIR=/tmp
LIB = ../src/cgilib.a
LDFLAGS= -lpng -lgd -lz -lm 

#INSTALLDIR= /usr/local/etc/httpd/cgi-bin
INSTALLCGIDIR= /home/httpd/cgi-bin
INSTALLHTMLDIR= /home/httpd/html
TARGETS = simple-webmail.cgi test-input.cgi test-config.cgi get_url_to_file.cgi\
	  test-template.cgi test-cookie.cgi test-language.cgi test-ipinfo.cgi\
	  showgif.cgi showtimelist.cgi showuserinfo.cgi test-guest.cgi test-session.cgi \
	  test-url.cgi test-timeuse.cgi authnum.cgi check_auth.cgi

# targets
simple-webmail.cgi: $(LIB) simple-webmail.cgi.o
	$(CC) -o $@ simple-webmail.cgi.o $(LIB)

test-input.cgi: $(LIB) test-input.cgi.o
	$(CC) -o $@ test-input.cgi.o $(LIB)

test-config.cgi: $(LIB) test-config.cgi.o
	$(CC) -o $@ test-config.cgi.o $(LIB)

get_url_to_file.cgi: $(LIB) get_url_to_file.cgi.o
	$(CC) -o $@ get_url_to_file.cgi.o $(LIB)

test-template.cgi: $(LIB) test-template.cgi.o
	$(CC) -o $@ test-template.cgi.o $(LIB)

test-cookie.cgi: $(LIB) test-cookie.cgi.o
	$(CC) -o $@ test-cookie.cgi.o $(LIB)

test-language.cgi: $(LIB) test-language.cgi.o
	$(CC) -o $@ test-language.cgi.o $(LIB)

test-ipinfo.cgi: $(LIB) test-ipinfo.cgi.o
	$(CC) -o $@ test-ipinfo.cgi.o $(LIB)

showgif.cgi: $(LIB) showgif.cgi.o
	$(CC) -o $@ showgif.cgi.o $(LIB)

showtimelist.cgi: $(LIB) showtimelist.cgi.o
	$(CC) -o $@ showtimelist.cgi.o $(LIB)

showuserinfo.cgi: $(LIB) showuserinfo.cgi.o
	$(CC) -o $@ showuserinfo.cgi.o $(LIB)

test-guest.cgi: $(LIB) test-guest.cgi.o
	$(CC) -o $@ test-guest.cgi.o $(LIB)

test-session.cgi: $(LIB) test-session.cgi.o
	$(CC) -o $@ test-session.cgi.o $(LIB)

test-url.cgi: $(LIB) test-url.cgi.o
	$(CC) -o $@ test-url.cgi.o $(LIB)

test-timeuse.cgi: $(LIB) test-timeuse.cgi.o
	$(CC) -o $@ test-timeuse.cgi.o $(LIB)

authnum.cgi:  $(LIB) authnum.cgi.o 
	$(CC) -o $@ authnum.cgi.o  $(LIB)  $(LDFLAGS)

check_auth.cgi:  $(LIB) check_auth.cgi.o
	$(CC) -o $@ check_auth.cgi.o $(LIB) $(LDFLAGS)

$(LIB):
	cd ../src; make cgilib.a

all: $(TARGETS)

install: $(TARGETS)
	chmod a+x $(TARGETS)
	mv -f $(TARGETS) $(INSTALLCGIDIR)
	cp test-config.conf $(INSTALLCGIDIR)
	cp test-template.html $(INSTALLCGIDIR)
	cp simple-webmail.conf $(INSTALLCGIDIR)
	cp cgi-lib.gif $(INSTALLCGIDIR)
	cp cgi-lib.gif $(INSTALLHTMLDIR)
	cp test-upload-file.html $(INSTALLHTMLDIR)
	cp test-language.html $(INSTALLHTMLDIR)
	cp test-ipinfo.html $(INSTALLHTMLDIR)
	cp simple-webmail.html $(INSTALLHTMLDIR)
	cp index.html $(INSTALLHTMLDIR)
	cp test-authnum.html $(INSTALLHTMLDIR)
	cp test-url-*.html $(INSTALLHTMLDIR)

clean:
	rm -f *.o $(TARGETS)
