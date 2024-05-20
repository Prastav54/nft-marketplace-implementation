import{B as e,y as r,D as n,E as a}from"./index-ClxLoTQ8.js";const l=e(a)`
    background-color: ${t=>{var o;return(o=t.customize)==null?void 0:o.backgroundColor}};

    span {
        color: ${t=>{var o;return(o=t.customize)==null?void 0:o.textColor}};
        font-size: ${t=>{var o;return((o=t.customize)==null?void 0:o.fontSize)+"px"}};
    }

    svg {
        fill: ${t=>{var o;return(o=t.customize)==null?void 0:o.textColor}};
    }

    :after {
        background-color: transparent;
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

    :hover {
        background-color: ${t=>{var o;return(o=t.customize)==null?void 0:o.backgroundColor}};

        :after {
            background-color: ${t=>{var o;return((o=t.customize)==null?void 0:o.onHover)==="lighten"?r("light",20):r("dark",20)}};
        }
    }

    :active {
        :after {
            background-color: ${t=>{var o;return((o=t.customize)==null?void 0:o.onHover)==="lighten"?r("light",40):r("dark",40)}};
        }
    }
`;var u={ButtonCustomStyled:l};const{ButtonCustomStyled:s}=u,c=({customize:t,...o})=>n(s,{customize:t,...o});export{c as default};
