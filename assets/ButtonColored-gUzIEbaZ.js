import{x as r,y as l,z as o,B as a,D as n,E as s}from"./index-R8wq8AXP.js";const t=r`
    :after {
        background-color: ${l("light",90)};
    }

    :hover {
        :after {
            background-color: ${l("light",70)};
        }
    }

    :active {
        :after {
            background-color: ${l("light",50)};
        }
    }
`,d=r`
    background-color: ${o.red};
    border-color: ${o.red};
    color: ${o.red};

    :focus {
        box-shadow: 0px 0px 0px 2px ${o.paleCerulean};
    }

    svg {
        fill: ${o.red};
    }

    ${t}
`,$=r`
    background-color: ${o.green};
    border-color: ${o.green};
    color: ${o.green};

    :focus {
        box-shadow: 0px 0px 0px 2px ${o.paleCerulean};
    }

    svg {
        fill: ${o.green};
    }

    ${t}
`,u=r`
    background-color: ${o.blue};
    border-color: ${o.blue};
    color: ${o.blue};

    :focus {
        box-shadow: 0px 0px 0px 2px ${o.paleCerulean};
    }

    svg {
        fill: ${o.blue};
    }

    ${t}
`,p=r`
    background-color: ${o.yellow};
    border-color: ${o.yellow};
    color: ${o.yellow};

    :focus {
        box-shadow: 0px 0px 0px 2px ${o.paleCerulean};
    }

    svg {
        fill: ${o.yellow};
    }

    ${t}
`,x=e=>{switch(e){case"red":return d;case"green":return $;case"blue":return u;case"yellow":return p;default:return}},b=a(s)`
    :after {
        background-color: ${l("dark",0)};
        content: '';
        display: block;
        height: 100%;
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 0;
        transition: all 0.3s ease;
        width: 100%;
        z-index: 0;
    }

    ${({color:e})=>e&&x(e)}
`;var g={ButtonColoredStyled:b};const{ButtonColoredStyled:i}=g,h=({color:e,...c})=>n(i,{color:e,...c});export{h as default};
