ARG PYTHON_TAG=3.6.4-alpine3.7

FROM python:${PYTHON_TAG} as python-base
RUN apk add --no-cache \
        gettext-dev \
        postgresql-dev \
        gcc \
        musl-dev \
        jpeg-dev \
        zlib-dev \
        linux-headers
COPY requirements.txt .
RUN pip install -r requirements.txt

FROM python:${PYTHON_TAG}
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH $PYTHONPATH:project/code
ENV MYPYPATH $PYTHONPATH:project/code

RUN apk add --no-cache \
        gettext \
        libpq \
        libjpeg \
        mailcap
COPY --from=python-base /root/.cache /root/.cache
COPY --from=python-base requirements.txt .
RUN pip install -r requirements.txt && rm -rf /root/.cache/pip

WORKDIR /project/code
COPY . /project/code

RUN addgroup -S django \
    && adduser -S -G django django \
    && chown -R django:django /project \
    && mkdir /project/media /project/static \
    && chown -R django:django /project/media \
    && chown -R django:django /project/static

USER django
ENTRYPOINT ["./entrypoint.sh"]
CMD uwsgi --ini=./uwsgi.ini
