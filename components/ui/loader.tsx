"use client";

import { ThreeCircles } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] m-0 grid size-full place-items-center bg-slate-900/50 backdrop-blur-sm p-0">
            <div className="grid size-28 place-items-center rounded-2xl bg-white shadow-2xl">
                <ThreeCircles
                    visible={true}
                    height="64"
                    width="64"
                    color="#2563eb"
                    ariaLabel="three-circles-loading"
                    innerCircleColor="#3b82f6"
                    middleCircleColor="#93c5fd"
                    outerCircleColor="#2563eb"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        </div>
    );
};

export default Loader;