#!/usr/bin/env bash
docker stop moral-dilemma || true && docker rm moral-dilemma || true
docker build -t adam/moral-dilemma .
docker run --name moral-dilemma -d -p 4567:4567 adam/moral-dilemma
