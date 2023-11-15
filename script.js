"use strict";
console.clear();
gsap.registerPlugin(MotionPathPlugin);
const App = () => {
    const [opened, setOpened] = React.useState(0);
    const [inPlace, setInPlace] = React.useState(0);
    const [disabled, setDisabled] = React.useState(false);
    const images = [
        { title: 'Sonic Sniper', url: '/img/LOGO6.png' },
        { title: 'Sonic Sniper', url: '/img/LOGO5.png' },
        { title: 'Sonic Sniper', url: '/img/LOGO1.png' },
        { title: 'Sonic Sniper', url: '/img/LOGO2.png' },
        { title: 'Sonic Sniper', url: '/img/LOGO3.png' },
        { title: 'Sonic Sniper', url: '/img/LOGO4.png' },
    ];
    const onClick = (index) => { if (!disabled)
        setOpened(index); };
    const onInPlace = (index) => setInPlace(index);
    const next = () => {
        let nextIndex = opened + 1;
        if (nextIndex >= images.length)
            nextIndex = 0;
        onClick(nextIndex);
    };
    React.useEffect(() => setDisabled(true), [opened]);
    React.useEffect(() => setDisabled(false), [inPlace]);
    

    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container shadow" },
            images.map((image, i) => React.createElement("div", { key: image.url, className: "image", style: { zIndex: inPlace === i ? i : images.length + 1 } },
                React.createElement(Image, { total: images.length, id: i, url: image.url, title: image.title, open: opened === i, inPlace: inPlace === i, onInPlace: onInPlace }))),
            React.createElement("div", { className: "tabs" },
                React.createElement(Tabs, { className: "tabs", images: images, onSelect: onClick }))),
        
            
              
                React.createElement("path", { d: "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" }),
                ));
};
const Image = ({ url, title, open, inPlace, id, onInPlace, total }) => {
    const [firstLoad, loaded] = React.useState(true);
    const clip = React.useRef(null);
    const border = React.useRef(null);
    const gap = 10;
    const circle = 7;
    const defaults = { transformOrigin: 'center center' };
    const duration = 0.4;
    const width = 400;
    const height = 400;
    const scale = 700;
    let bigSize = (circle * scale);
    let overlap = 0;
    const getPosSmall = () => ({ x: (width / 2) - ((total * ((circle * 2) + gap) - gap) / 2) + (id * ((circle * 2) + gap)), y: height - 30, scale: 1 });
    const getPosSmallAbove = () => ({ x: (width / 2) - ((total * ((circle * 2) + gap) - gap) / 2) + (id * ((circle * 2) + gap)), y: height / 2, scale: 1 });
    const getPosSmallBelow = () => ({ x: width * 0.5, y: height - 30, scale: 1 });
    const getPosCenter = () => ({ x: width / 2, y: height / 2, scale: 7 });
    const getPosEnd = () => ({ x: width / 2 - bigSize + overlap, y: height / 2, scale: scale });
    const getPosStart = () => ({ x: width / 2 + bigSize - overlap, y: height / 2, scale: scale });
    const onStateChange = () => {
        loaded(false);
        if (border.current) {
            gsap.set(border.current, Object.assign(Object.assign({}, defaults), getPosSmall()));
            console.log(border.current);
        }
        if (clip.current) {
            let flipDuration = firstLoad ? 0 : duration;
            let upDuration = firstLoad ? 0 : 0.2;
            let bounceDuration = firstLoad ? 0.01 : 1;
            let delay = firstLoad ? 0 : flipDuration + upDuration;
            if (open) {
                
                gsap.timeline()
                    .set(clip.current, Object.assign(Object.assign({}, defaults), getPosSmall()))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosCenter()), { duration: upDuration, ease: 'power3.inOut' }))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosEnd()), { duration: flipDuration, ease: 'power4.in', onComplete: () => onInPlace(id) }));
            }
            else {
                gsap.timeline();
                
                gsap.timeline({ overwrite: true })
                    .set(clip.current, Object.assign(Object.assign({}, defaults), getPosStart()))
                    .to(clip.current, Object.assign(Object.assign(Object.assign({}, defaults), getPosCenter()), { delay: delay, duration: flipDuration, ease: 'power4.out' }))
                    .to(clip.current, Object.assign(Object.assign({}, defaults), { motionPath: [getPosSmallAbove(), getPosSmall()], duration: bounceDuration, ease: 'bounce.out' }));
            }
        }
    };
    React.useEffect(onStateChange, [open, clip]);
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "xMidYMid slice" },
        React.createElement("defs", null,
            React.createElement("clipPath", { id: id + "_circleClip" },
                React.createElement("circle", { class: "clip", cx: "0", cy: "0", r: circle, ref: clip })),
            React.createElement("clipPath", { id: id + "_squareClip" },
                React.createElement("rect", { class: "clip", width: width, height: height }))),
        React.createElement("g", { clipPath: `url(#${id + (inPlace ? '_squareClip' : '_circleClip')})` },
            React.createElement("image", { width: width, height: height, xlinkHref: url }))));
};
const Tabs = ({ images, onSelect }) => {
    const gap = 10;
    const circle = 7;
    const defaults = { transformOrigin: 'center center' };
    const width = 400;
    const height = 400;
    const getPosX = (i) => (width / 2) - ((images.length * ((circle * 2) + gap) - gap) / 2) + (i * ((circle * 2) + gap));
    const getPosY = (i) => height - 30;
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "xMidYMid slice" }, (!images ? [] : images).map((image, i) => React.createElement("circle", { onClick: () => onSelect(i), className: "border", cx: getPosX(i), cy: getPosY(i), r: circle + 2 }))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

