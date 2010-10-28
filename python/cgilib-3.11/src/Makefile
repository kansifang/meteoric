# Makefile for cgilib.a

# macros and variables
CC= gcc
RANLIB= ranlib
#INCLUDES =-I../include
CFLAGS= -g -Wall -DUNIX -I../include #-DUPLOADDIR='"/tmp"'
#CFLAGS = -g -Wall -DWINDOWS #-DUPLOADDIR='"/tmp"'

#INSTALLDIR= /home/httpd/cgi-src

OBJS = string-lib.o list-lib.o cgi-lib.o time-lib.o language-lib.o html-lib.o config-lib.o file-lib.o \
	httpc-lib.o internet-lib.o template-lib.o other-lib.o mysql-lib.o cookie-lib.o \
	md5-lib.o session-lib.o authnum-lib.o
LIB = cgilib.a

# targets
$(LIB): $(OBJS)
	ar cr $@ $(OBJS)
	$(RANLIB) $@

examples: $(LIB)
	cd ../examples; make all

all: examples

install: 
	cp -f ../include/*.h $(LIB) $(INSTALLDIR)
	make all
	cd ../examples; make install

clean:
	rm -f *.o $(LIB)

clobber:
	rm -f *.o $(LIB)
	cd ../examples; make clean

