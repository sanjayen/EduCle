#!/bin/sh
### ====================================================================== ###
##                                                                          ##
##  pdfsam Bootstrap Script                                                  ##
##                                                                          ##
### ====================================================================== ###

warn() {
    echo "${PROGNAME}: $*"
}

die() {
    warn $*
    exit 1
}


DIRNAME="../lib/"
CONSOLEJAR="$DIRNAME/pdfsam-console-2.4.3e.jar"

# Setup the classpath
if [ ! -f "$CONSOLEJAR" ]; then
    die "Missing required file: $CONSOLEJAR"
fi
CONSOLE_CLASSPATH="$CONSOLEJAR"

# Setup the JVM
if [ "x$JAVA" = "x" ]; then
    if [ "x$JAVA_HOME" != "x" ]; then
	JAVA="$JAVA_HOME/bin/java"
    else
	JAVA="java"
    fi
fi

# Setup sepecific properties
JAVA_OPTS="-Dlog4j.configuration=console-log4j.xml"

# Display our environment
echo "========================================================================="
echo ""
echo " pdfsam console"
echo ""
echo " available properties:"
echo " pdfsam.log.console.level"
echo " pdfsam.log.file.level"
echo " pdfsam.log.file.filename"
echo ""
echo "  JAVA: $JAVA"
echo ""
echo "  JAVA_OPTS: $JAVA_OPTS"
echo ""
echo "  CLASSPATH: $CONSOLE_CLASSPATH"
echo ""
echo "========================================================================="
echo ""

# Execute the JVM in the foreground
      "$JAVA" $JAVA_OPTS \
         -classpath "$CONSOLE_CLASSPATH" \
         org.pdfsam.console.ConsoleClient "$@"