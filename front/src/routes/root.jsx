import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";

export default function Root() {
    let location = useLocation();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // size canvas to its container (landing-main)
            function resize() {
                const parent = canvas.parentElement;
                const w = parent.clientWidth || window.innerWidth;
                const h = parent.clientHeight || window.innerHeight;
                canvas.width = w;
                canvas.height = h;
                // re-setup stars for new size
                setup();
            }

            resize();
            window.addEventListener("resize", resize);

        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let centerX = canvasWidth * 0.5;
        let centerY = canvasHeight * 0.5;

        const numberOfStars = 500;
        const frames_per_second = 60;
        const interval = Math.floor(1000 / frames_per_second);

        let startTime = performance.now();
        let previousTime = startTime;
        let currentTime = 0;
        let deltaTime = 0;

        const stars = [];

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function remap(value, inMin, inMax, outMin, outMax) {
            // handle zero-length input range
            if (inMax - inMin === 0) return outMin;
            const t = (value - inMin) / (inMax - inMin);
            return outMin + t * (outMax - outMin);
        }

        class Star {
            constructor() {
                this.x = getRandomInt(-centerX, centerX);
                this.y = getRandomInt(-centerY, centerY);
                this.counter = getRandomInt(1, canvasWidth);

                this.radiusMax = 1 + Math.random() * 10;
                this.speed = getRandomInt(1, 5);
            }

            drawStar() {
                this.counter -= this.speed;

                if (this.counter < 1) {
                    this.counter = canvasWidth;
                    this.x = getRandomInt(-centerX, centerX);
                    this.y = getRandomInt(-centerY, centerY);

                    this.radiusMax = getRandomInt(1, 10);
                    this.speed = getRandomInt(1, 5);
                }

                // avoid division by zero
                const xRatio = this.x / Math.max(1, this.counter);
                const yRatio = this.y / Math.max(1, this.counter);

                const starX = remap(xRatio, -1, 1, 0, canvasWidth);
                const starY = remap(yRatio, -1, 1, 0, canvasHeight);

                this.radius = remap(this.counter, 0, canvasWidth, this.radiusMax, 0);

                ctx.beginPath();
                ctx.arc(starX, starY, Math.max(0.2, this.radius), 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fillStyle = "#FFF";
                ctx.fill();
            }
        }

        function setup() {
            // refresh sizing dependent values
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            centerX = canvasWidth * 0.5;
            centerY = canvasHeight * 0.5;

            stars.length = 0;
            for (let i = 0; i < numberOfStars; i++) {
                stars.push(new Star());
            }
        }

        setup();

        function draw(timestamp) {
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;

            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);

                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.fillStyle = "#111";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                        for (let i = 0; i < stars.length; i++) {
                            stars[i].drawStar();
                        }
            }

            animationRef.current = requestAnimationFrame(draw);
        }

        animationRef.current = requestAnimationFrame(draw);

        // Re-setup on resize so stars scale properly
        const resizeObserver = () => {
            // small timeout to allow layout to settle
            setTimeout(() => {
                setup();
            }, 50);
        };

        window.addEventListener("resize", resizeObserver);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("resize", resizeObserver);
        };
    }, []);

    return (
        <div className="landing-main" id="landing-main">
            <canvas ref={canvasRef} className="outerspace" />
            <img className="landing-logo" src="../logoT.png" alt="Stellar Resolution Logo" />
            <p className="landing-title"> Stellar Resolution </p>
            <p className="landing-subtitle"> Your Gateway to the Stars </p>
            <button className= "landing-button"onClick={() => navigate("/app")}>Take-off</button>
        </div>
    );
}
