#!/usr/bin/env python3
import logging
import os
import urllib.request
import uuid
from argparse import ArgumentParser
from subprocess import check_call

DEFAULT_FILENAME = 'vendor.min.js'

parser = ArgumentParser()
parser.add_argument('-O', '--out-file', default=DEFAULT_FILENAME)
parser.add_argument('-M', '--map-file', default='{}.map'.format(DEFAULT_FILENAME))
parser.add_argument('jsfile', nargs='+')


COMPILLER_JAR = os.path.join(
    os.path.abspath(os.path.dirname(__file__)),
    'closure-compiller.jar'
)

CACHE_PATH = os.path.join(
    os.path.abspath(os.path.dirname(__file__)),
    '.vendor-cache'
)

OPENER = urllib.request.build_opener()
OPENER.addheaders = [
    # Cloud-flare can't pass the requests without it
    ('User-Agent', ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) '
                    'Chrome/58.0.3029.110 Safari/537.36')),
    ('Referer', 'https://www.google.com/')
]


def download_js(url) -> str:
    os.makedirs(CACHE_PATH, exist_ok=True)

    fname = os.path.join(
        CACHE_PATH,
        "%s.js" % uuid.uuid3(uuid.NAMESPACE_URL, url)
    )

    if os.path.exists(fname):
        logging.info("Using cache %r", url)
        return fname

    resp = OPENER.open(url)

    logging.info("Downloading %r", url)
    with open(fname, 'wb+') as fd:
        fd.write(resp.read())

    return fname


def main():
    logging.basicConfig(level=logging.INFO)

    args = parser.parse_args()

    cmd = [
        'closure-compiler',
        '--js_output_file', args.out_file,
        '--create_source_map', args.map_file
    ]

    for file in args.jsfile:
        cmd += ['--js', download_js(file) if '://' in file else file]

    logging.info("Executing %r", cmd)
    check_call(cmd)


if __name__ == '__main__':
    main()
