#!usr/bin/env python2

import sys
from ping import traceroute


def run():
    if len(sys.argv) < 2:
        print("There is not argument with host name")
        return
    traceroute(sys.argv[1])


if __name__ == "__main__":
    run()
