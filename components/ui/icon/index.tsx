"use client";
import React from "react";
import { createIcon } from "@gluestack-ui/icon";
import { Path } from "react-native-svg";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";
import { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, IPrimitiveIcon, Svg } from "@gluestack-ui/icon";

export const UIIcon = createIcon({
  Root: PrimitiveIcon,
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
    React.RefAttributes<React.ElementRef<typeof Svg>>
>;

const iconStyle = tva({
  base: "text-typography-950 fill-none pointer-events-none",
  variants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
});

cssInterop(UIIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type IIConProps = IPrimitiveIcon &
  VariantProps<typeof iconStyle> &
  React.ComponentPropsWithoutRef<typeof UIIcon>;

const Icon = React.forwardRef<React.ElementRef<typeof Svg>, IIConProps>(
  ({ size = "md", className, ...props }, ref) => {
    if (typeof size === "number") {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
          size={size}
        />
      );
    } else if (
      (props.height !== undefined || props.width !== undefined) &&
      size === undefined
    ) {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
        />
      );
    }
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={iconStyle({ size, class: className })}
      />
    );
  }
);

export { Icon };

type ParameterTypes = Omit<Parameters<typeof createIcon>[0], "Root">;

const createIconUI = ({ ...props }: ParameterTypes) => {
  const UIIconCreateIcon = createIcon({
    Root: Svg,
    ...props,
  }) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
      React.RefAttributes<React.ElementRef<typeof Svg>>
  >;

  return React.forwardRef<React.ElementRef<typeof Svg>>(
    (
      {
        className,
        size,
        ...inComingProps
      }: VariantProps<typeof iconStyle> &
        React.ComponentPropsWithoutRef<typeof UIIconCreateIcon>,
      ref
    ) => {
      return (
        <UIIconCreateIcon
          ref={ref}
          {...inComingProps}
          className={iconStyle({ size, class: className })}
        />
      );
    }
  );
};
export { createIconUI as createIcon };

export const DashboardIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <path
      d="M1.5 3.75C1.5 3.15326 1.73705 2.58097 2.15901 2.15901C2.58097 1.73705 3.15326 1.5 3.75 1.5H8.25C8.84674 1.5 9.41903 1.73705 9.84099 2.15901C10.2629 2.58097 10.5 3.15326 10.5 3.75V8.25C10.5 8.84674 10.2629 9.41903 9.84099 9.84099C9.41903 10.2629 8.84674 10.5 8.25 10.5H3.75C3.15326 10.5 2.58097 10.2629 2.15901 9.84099C1.73705 9.41903 1.5 8.84674 1.5 8.25V3.75ZM3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V8.25C3 8.44891 3.07902 8.63968 3.21967 8.78033C3.36032 8.92098 3.55109 9 3.75 9H8.25C8.44891 9 8.63968 8.92098 8.78033 8.78033C8.92098 8.63968 9 8.44891 9 8.25V3.75C9 3.55109 8.92098 3.36032 8.78033 3.21967C8.63968 3.07902 8.44891 3 8.25 3H3.75ZM13.5 3.75C13.5 3.15326 13.7371 2.58097 14.159 2.15901C14.581 1.73705 15.1533 1.5 15.75 1.5H20.25C20.8467 1.5 21.419 1.73705 21.841 2.15901C22.2629 2.58097 22.5 3.15326 22.5 3.75V8.25C22.5 8.84674 22.2629 9.41903 21.841 9.84099C21.419 10.2629 20.8467 10.5 20.25 10.5H15.75C15.1533 10.5 14.581 10.2629 14.159 9.84099C13.7371 9.41903 13.5 8.84674 13.5 8.25V3.75ZM15.75 3C15.5511 3 15.3603 3.07902 15.2197 3.21967C15.079 3.36032 15 3.55109 15 3.75V8.25C15 8.44891 15.079 8.63968 15.2197 8.78033C15.3603 8.92098 15.5511 9 15.75 9H20.25C20.4489 9 20.6397 8.92098 20.7803 8.78033C20.921 8.63968 21 8.44891 21 8.25V3.75C21 3.55109 20.921 3.36032 20.7803 3.21967C20.6397 3.07902 20.4489 3 20.25 3H15.75ZM1.5 15.75C1.5 15.1533 1.73705 14.581 2.15901 14.159C2.58097 13.7371 3.15326 13.5 3.75 13.5H8.25C8.84674 13.5 9.41903 13.7371 9.84099 14.159C10.2629 14.581 10.5 15.1533 10.5 15.75V20.25C10.5 20.8467 10.2629 21.419 9.84099 21.841C9.41903 22.2629 8.84674 22.5 8.25 22.5H3.75C3.15326 22.5 2.58097 22.2629 2.15901 21.841C1.73705 21.419 1.5 20.8467 1.5 20.25V15.75ZM3.75 15C3.55109 15 3.36032 15.079 3.21967 15.2197C3.07902 15.3603 3 15.5511 3 15.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H8.25C8.44891 21 8.63968 20.921 8.78033 20.7803C8.92098 20.6397 9 20.4489 9 20.25V15.75C9 15.5511 8.92098 15.3603 8.78033 15.2197C8.63968 15.079 8.44891 15 8.25 15H3.75ZM13.5 15.75C13.5 15.1533 13.7371 14.581 14.159 14.159C14.581 13.7371 15.1533 13.5 15.75 13.5H20.25C20.8467 13.5 21.419 13.7371 21.841 14.159C22.2629 14.581 22.5 15.1533 22.5 15.75V20.25C22.5 20.8467 22.2629 21.419 21.841 21.841C21.419 22.2629 20.8467 22.5 20.25 22.5H15.75C15.1533 22.5 14.581 22.2629 14.159 21.841C13.7371 21.419 13.5 20.8467 13.5 20.25V15.75ZM15.75 15C15.5511 15 15.3603 15.079 15.2197 15.2197C15.079 15.3603 15 15.5511 15 15.75V20.25C15 20.4489 15.079 20.6397 15.2197 20.7803C15.3603 20.921 15.5511 21 15.75 21H20.25C20.4489 21 20.6397 20.921 20.7803 20.7803C20.921 20.6397 21 20.4489 21 20.25V15.75C21 15.5511 20.921 15.3603 20.7803 15.2197C20.6397 15.079 20.4489 15 20.25 15H15.75Z"
      fill="#067368"
    />
  ),
});

export const UsersIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <path
      d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7957 19.5003 21.8859 19.6456 21.9171 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9217 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9853 12 9.49999 12C7.01471 12 4.99999 9.98528 4.99999 7.5C4.99999 5.01472 7.01471 3 9.49999 3C11.9853 3 14 5.01472 14 7.5ZM2.55922 18.9383C4.15353 16.5446 6.66936 15 9.49999 15C12.3306 15 14.8465 16.5446 16.4408 18.9383C16.79 19.4628 16.9647 19.725 16.9446 20.0599C16.9289 20.3207 16.7579 20.64 16.5496 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82235C3.08616 21 2.71807 21 2.45043 20.7976C2.24204 20.64 2.07108 20.3207 2.05542 20.0599C2.03532 19.725 2.20995 19.4628 2.55922 18.9383Z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  ),
});

export const AnalyticsIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 20 21",
  path: (
    <path d="M11.6667 3C12.5872 3 13.3333 3.74619 13.3333 4.66667V7.16667H16.6667C17.5872 7.16667 18.3333 7.91286 18.3333 8.83333V16.3333C18.3333 17.2538 17.5872 18 16.6667 18H3.33332C2.41285 18 1.66666 17.2538 1.66666 16.3333V11.3333C1.66666 10.4128 2.41285 9.66667 3.33332 9.66667H6.66666V4.66667C6.66666 3.74619 7.41285 3 8.33332 3H11.6667ZM11.6667 4.66667H8.33332V16.3333H11.6667V4.66667ZM16.6667 8.83333H13.3333V16.3333H16.6667V8.83333ZM6.66666 11.3333H3.33332V16.3333H6.66666V11.3333Z" />
  ),
});

export const LogoutIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <path
      d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9"
      stroke="#FF1F46"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  ),
});

export const ProfileIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 50 50",
  path: (
    <>
      <path
        d="M25 28C21.8299 28 19.0108 29.5306 17.216 31.906C16.8297 32.4172 16.6365 32.6728 16.6429 33.0183C16.6477 33.2852 16.8153 33.6219 17.0253 33.7867C17.2972 34 17.6738 34 18.4272 34H31.5727C32.3261 34 32.7028 34 32.9746 33.7867C33.1846 33.6219 33.3522 33.2852 33.3571 33.0183C33.3634 32.6728 33.1703 32.4172 32.784 31.906C30.9892 29.5306 28.17 28 25 28Z"
        fill="#067368"
      />
      <path
        d="M25 25C27.4853 25 29.5 22.9853 29.5 20.5C29.5 18.0147 27.4853 16 25 16C22.5147 16 20.5 18.0147 20.5 20.5C20.5 22.9853 22.5147 25 25 25Z"
        fill="#067368"
      />
      <path
        d="M25 28C21.8299 28 19.0108 29.5306 17.216 31.906C16.8297 32.4172 16.6365 32.6728 16.6429 33.0183C16.6477 33.2852 16.8153 33.6219 17.0253 33.7867C17.2972 34 17.6738 34 18.4272 34H31.5727C32.3261 34 32.7028 34 32.9746 33.7867C33.1846 33.6219 33.3522 33.2852 33.3571 33.0183C33.3634 32.6728 33.1703 32.4172 32.784 31.906C30.9892 29.5306 28.17 28 25 28Z"
        stroke="#067368"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25 25C27.4853 25 29.5 22.9853 29.5 20.5C29.5 18.0147 27.4853 16 25 16C22.5147 16 20.5 18.0147 20.5 20.5C20.5 22.9853 22.5147 25 25 25Z"
        stroke="#067368"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </>
  ),
});
// All Icons
const AddIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 5V19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

AddIcon.displayName = "AddIcon";
export { AddIcon };

const AlertCircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

AlertCircleIcon.displayName = "AlertCircleIcon";
export { AlertCircleIcon };

const ArrowUpIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 19V5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12L12 5L19 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowDownIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 5V19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 12L12 19L5 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowRightIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 5L19 12L12 19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ArrowLeftIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M19 12H5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19L5 12L12 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ArrowUpIcon.displayName = "ArrowUpIcon";
ArrowDownIcon.displayName = "ArrowDownIcon";
ArrowRightIcon.displayName = "ArrowRightIcon";
ArrowLeftIcon.displayName = "ArrowLeftIcon";

export { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, ArrowLeftIcon };

const AtSignIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <>
        <Path
          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 7.99999V13C16 13.7956 16.3161 14.5587 16.8787 15.1213C17.4413 15.6839 18.2044 16 19 16C19.7957 16 20.5587 15.6839 21.1213 15.1213C21.6839 14.5587 22 13.7956 22 13V12C21.9999 9.74302 21.2362 7.55247 19.8333 5.78452C18.4303 4.01658 16.4706 2.77521 14.2726 2.26229C12.0747 1.74936 9.76794 1.99503 7.72736 2.95936C5.68677 3.92368 4.03241 5.54995 3.03327 7.57371C2.03413 9.59748 1.74898 11.8997 2.22418 14.1061C2.69938 16.3125 3.90699 18.2932 5.65064 19.7263C7.39429 21.1593 9.57144 21.9603 11.8281 21.9991C14.0847 22.0379 16.2881 21.3122 18.08 19.94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    </>
  ),
});

AtSignIcon.displayName = "AtSignIcon";

export { AtSignIcon };

const BellIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

BellIcon.displayName = "BellIcon";

export { BellIcon };

const CalendarDaysIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 2V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 10H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14H8.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 14H16.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 18H8.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 18H16.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CalendarDaysIcon.displayName = "CalendarDaysIcon";

export { CalendarDaysIcon };

const CheckIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M20 6L9 17L4 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const CheckCircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CheckIcon.displayName = "CheckIcon";
CheckCircleIcon.displayName = "CheckCircleIcon";

export { CheckIcon, CheckCircleIcon };

const ChevronUpIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  d: "M12 10L8 6L4 10",
  path: (
    <>
      <Path
        d="M18 15L12 9L6 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronDownIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M6 9L12 15L18 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronLeftIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M15 18L9 12L15 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronRightIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M9 18L15 12L9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsLeftIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M11 17L6 12L11 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 17L13 12L18 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsRightIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M13 17L18 12L13 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 17L11 12L6 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const ChevronsUpDownIcon = createIcon({
  Root: Svg,

  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M7 15L12 20L17 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 9L12 4L17 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ChevronUpIcon.displayName = "ChevronUpIcon";
ChevronDownIcon.displayName = "ChevronDownIcon";
ChevronLeftIcon.displayName = "ChevronLeftIcon";
ChevronRightIcon.displayName = "ChevronRightIcon";
ChevronsLeftIcon.displayName = "ChevronsLeftIcon";
ChevronsRightIcon.displayName = "ChevronsRightIcon";
ChevronsUpDownIcon.displayName = "ChevronsUpDownIcon";

export {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
};

const CircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CircleIcon.displayName = "CircleIcon";

export { CircleIcon };

const ClockIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6V12L16 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ClockIcon.displayName = "ClockIcon";

export { ClockIcon };

const CloseIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M18 6L6 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

const CloseCircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 9L9 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9L15 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CloseIcon.displayName = "CloseIcon";
CloseCircleIcon.displayName = "CloseCircleIcon";

export { CloseIcon, CloseCircleIcon };

const CopyIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

CopyIcon.displayName = "CopyIcon";

export { CopyIcon };

const DownloadIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10L12 15L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

DownloadIcon.displayName = "DownloadIcon";
export { DownloadIcon };

const EditIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EditIcon.displayName = "EditIcon";
export { EditIcon };

const EyeIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EyeIcon.displayName = "EyeIcon";

const EyeOffIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M9.88 9.88C9.58525 10.1546 9.34884 10.4859 9.18487 10.8538C9.02091 11.2218 8.93274 11.6191 8.92563 12.0219C8.91852 12.4247 8.99262 12.8248 9.14351 13.1984C9.29439 13.5719 9.51897 13.9113 9.80384 14.1962C10.0887 14.481 10.4281 14.7056 10.8016 14.8565C11.1752 15.0074 11.5753 15.0815 11.9781 15.0744C12.3809 15.0673 12.7782 14.9791 13.1461 14.8151C13.5141 14.6512 13.8453 14.4147 14.12 14.12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.73 5.08C11.1513 5.02751 11.5754 5.00079 12 5C19 5 22 12 22 12C21.5529 12.9571 20.9922 13.8569 20.33 14.68"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.61 6.61C4.62125 7.96462 3.02987 9.82526 2 12C2 12 5 19 12 19C13.9159 19.0051 15.7908 18.4451 17.39 17.39"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 2L22 22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

EyeOffIcon.displayName = "EyeOffIcon";
export { EyeIcon, EyeOffIcon };

const FavouriteIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M20.42 4.58C19.9183 4.07658 19.3222 3.67714 18.6658 3.40459C18.0094 3.13204 17.3057 2.99174 16.595 2.99174C15.8843 2.99174 15.1806 3.13204 14.5242 3.40459C13.8678 3.67714 13.2717 4.07658 12.77 4.58L12 5.36L11.23 4.58C10.7283 4.07658 10.1322 3.67714 9.47582 3.40459C8.81944 3.13204 8.11571 2.99174 7.40499 2.99174C6.69428 2.99174 5.99055 3.13204 5.33417 3.40459C4.67779 3.67714 4.08167 4.07658 3.57999 4.58C1.45999 6.7 1.32999 10.28 3.99999 13L12 21L20 13C22.67 10.28 22.54 6.7 20.42 4.58Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

FavouriteIcon.displayName = "FavouriteIcon";
export { FavouriteIcon };

const GlobeIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12H22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

GlobeIcon.displayName = "GlobeIcon";
export { GlobeIcon };

const GripVerticalIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4C14.4477 4 14 4.44772 14 5C14 5.55228 14.4477 6 15 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 20C15.5523 20 16 19.5523 16 19C16 18.4477 15.5523 18 15 18C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

GripVerticalIcon.displayName = "GripVerticalIcon";
export { GripVerticalIcon };

const HelpCircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91894 12.4272 7.03872C13.1255 7.15849 13.7588 7.52153 14.2151 8.06353C14.6713 8.60554 14.9211 9.29153 14.92 10C14.92 12 11.92 13 11.92 13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

HelpCircleIcon.displayName = "HelpCircleIcon";
export { HelpCircleIcon };

const InfoIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8H12.01"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

InfoIcon.displayName = "InfoIcon";
export { InfoIcon };

const LinkIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9404 15.7513 14.6898C16.4231 14.4392 17.0331 14.0471 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33397 21.9434 7.02299C21.932 5.71201 21.4061 4.45794 20.4791 3.5309C19.5521 2.60386 18.298 2.07802 16.987 2.06663C15.676 2.05523 14.413 2.55921 13.47 3.47L11.75 5.18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3935 9.60707C11.7643 9.26331 11.0685 9.05889 10.3534 9.00768C9.63821 8.95646 8.92041 9.05964 8.24866 9.31023C7.5769 9.56082 6.96689 9.95294 6.46 10.46L3.46 13.46C2.54921 14.403 2.04524 15.666 2.05663 16.977C2.06802 18.288 2.59387 19.5421 3.52091 20.4691C4.44795 21.3961 5.70201 21.922 7.013 21.9334C8.32398 21.9448 9.58699 21.4408 10.53 20.53L12.24 18.82"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LinkIcon.displayName = "LinkIcon";

const ExternalLinkIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 3H21V9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 14L21 3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ExternalLinkIcon.displayName = "ExternalLinkIcon";
export { LinkIcon, ExternalLinkIcon };

const LoaderIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M21 12C20.9999 13.9006 20.3981 15.7524 19.2809 17.2899C18.1637 18.8275 16.5885 19.9719 14.7809 20.5592C12.9733 21.1464 11.0262 21.1464 9.21864 20.559C7.41109 19.9716 5.83588 18.8271 4.71876 17.2895C3.60165 15.7519 2.99999 13.9001 3 11.9995C3.00001 10.0989 3.60171 8.24711 4.71884 6.7095C5.83598 5.17189 7.4112 4.02741 9.21877 3.44008C11.0263 2.85274 12.9734 2.85272 14.781 3.44"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LoaderIcon.displayName = "LoaderIcon";
export { LoaderIcon };

const LockIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

LockIcon.displayName = "LockIcon";
export { LockIcon };

const MailIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MailIcon.displayName = "MailIcon";
export { MailIcon };

const MenuIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M4 12H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 6H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 18H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MenuIcon.displayName = "MenuIcon";
export { MenuIcon };

const MessageCircleIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7117 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.60557 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MessageCircleIcon.displayName = "MessageCircleIcon";

export { MessageCircleIcon };

const MoonIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 3C10.8134 4.19491 10.1488 5.81141 10.1518 7.49539C10.1547 9.17936 10.825 10.7935 12.0157 11.9843C13.2065 13.175 14.8206 13.8453 16.5046 13.8482C18.1886 13.8512 19.8051 13.1866 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17294 13.7558C2.82567 12.01 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3V3Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

MoonIcon.displayName = "MoonIcon";
export { MoonIcon };

const PaperclipIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1141 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 2.00515 15.1615 2.00421C16.2239 2.00328 17.2431 2.42441 17.995 3.17497C18.7469 3.92554 19.1698 4.94404 19.1708 6.00644C19.1717 7.06883 18.7506 8.08808 18 8.83997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4642 6.20472 14.9553 6.58 14.58L15.07 6.09997"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PaperclipIcon.displayName = "PaperclipIcon";
export { PaperclipIcon };

const PhoneIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.271 2.12 4.18001C2.09501 3.90347 2.12788 3.62477 2.2165 3.36163C2.30513 3.09849 2.44757 2.85669 2.63477 2.65163C2.82196 2.44656 3.04981 2.28271 3.30379 2.17053C3.55778 2.05834 3.83234 2.00027 4.11 2.00001H7.11C7.59531 1.99523 8.06579 2.16708 8.43376 2.48354C8.80173 2.79999 9.04208 3.23945 9.11 3.72001C9.23662 4.68007 9.47145 5.62273 9.81 6.53001C9.94455 6.88793 9.97366 7.27692 9.89391 7.65089C9.81415 8.02485 9.62886 8.36812 9.36 8.64001L8.09 9.91001C9.51356 12.4136 11.5865 14.4865 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1859 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PhoneIcon.displayName = "PhoneIcon";
export { PhoneIcon };

const PlayIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 8L16 12L10 16V8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

PlayIcon.displayName = "PlayIcon";
export { PlayIcon };

const RemoveIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M5 12H19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

RemoveIcon.displayName = "RemoveIcon";
export { RemoveIcon };

const RepeatIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M17 2L21 6L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11V10C3 8.93913 3.42143 7.92172 4.17157 7.17157C4.92172 6.42143 5.93913 6 7 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 22L3 18L7 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13V14C21 15.0609 20.5786 16.0783 19.8284 16.8284C19.0783 17.5786 18.0609 18 17 18H3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

RepeatIcon.displayName = "RepeatIcon";

const Repeat1Icon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M17 2L21 6L17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11V10C3 8.93913 3.42143 7.92172 4.17157 7.17157C4.92172 6.42143 5.93913 6 7 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 22L3 18L7 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13V14C21 15.0609 20.5786 16.0783 19.8284 16.8284C19.0783 17.5786 18.0609 18 17 18H3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 10H12V14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

Repeat1Icon.displayName = "Repeat1Icon";
export { RepeatIcon, Repeat1Icon };

const SearchIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 21L16.65 16.65"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };

const SettingsIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04596 6.33554 7.70108 6.42795 7.35 6.42795C6.99893 6.42795 6.65404 6.33554 6.35 6.16L6.2 6.08C5.74107 5.81526 5.19584 5.74344 4.684 5.88031C4.17217 6.01717 3.73555 6.35154 3.47 6.81L3.25 7.19C2.98526 7.64893 2.91345 8.19416 3.05031 8.706C3.18717 9.21783 3.52154 9.65445 3.98 9.92L4.13 10.02C4.43228 10.1945 4.68362 10.4451 4.85905 10.7468C5.03448 11.0486 5.1279 11.391 5.13 11.74V12.25C5.1314 12.6024 5.03965 12.949 4.86405 13.2545C4.68844 13.5601 4.43521 13.8138 4.13 13.99L3.98 14.08C3.52154 14.3456 3.18717 14.7822 3.05031 15.294C2.91345 15.8058 2.98526 16.3511 3.25 16.81L3.47 17.19C3.73555 17.6485 4.17217 17.9828 4.684 18.1197C5.19584 18.2566 5.74107 18.1847 6.2 17.92L6.35 17.84C6.65404 17.6645 6.99893 17.5721 7.35 17.5721C7.70108 17.5721 8.04596 17.6645 8.35 17.84L8.78 18.09C9.08374 18.2654 9.33602 18.5175 9.51154 18.8212C9.68706 19.1248 9.77964 19.4693 9.78 19.82V20C9.78 20.5304 9.99072 21.0391 10.3658 21.4142C10.7409 21.7893 11.2496 22 11.78 22H12.22C12.7504 22 13.2591 21.7893 13.6342 21.4142C14.0093 21.0391 14.22 20.5304 14.22 20V19.82C14.2204 19.4693 14.3129 19.1248 14.4885 18.8212C14.664 18.5175 14.9163 18.2654 15.22 18.09L15.65 17.84C15.954 17.6645 16.2989 17.5721 16.65 17.5721C17.0011 17.5721 17.346 17.6645 17.65 17.84L17.8 17.92C18.2589 18.1847 18.8042 18.2566 19.316 18.1197C19.8278 17.9828 20.2645 17.6485 20.53 17.19L20.75 16.8C21.0147 16.3411 21.0866 15.7958 20.9497 15.284C20.8128 14.7722 20.4785 14.3356 20.02 14.07L19.87 13.99C19.5648 13.8138 19.3116 13.5601 19.136 13.2545C18.9604 12.949 18.8686 12.6024 18.87 12.25V11.75C18.8686 11.3976 18.9604 11.051 19.136 10.7455C19.3116 10.4399 19.5648 10.1862 19.87 10.01L20.02 9.92C20.4785 9.65445 20.8128 9.21783 20.9497 8.706C21.0866 8.19416 21.0147 7.64893 20.75 7.19L20.53 6.81C20.2645 6.35154 19.8278 6.01717 19.316 5.88031C18.8042 5.74344 18.2589 5.81526 17.8 6.08L17.65 6.16C17.346 6.33554 17.0011 6.42795 16.65 6.42795C16.2989 6.42795 15.954 6.33554 15.65 6.16L15.22 5.91C14.9163 5.73464 14.664 5.48248 14.4885 5.17884C14.3129 4.87519 14.2204 4.53073 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2V2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SettingsIcon.displayName = "SettingsIcon";
export { SettingsIcon };

const ShareIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.59 13.51L15.42 17.49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.41 6.51L8.59 10.49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ShareIcon.displayName = "ShareIcon";
export { ShareIcon };

const SlashIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.92999 4.92999L19.07 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SlashIcon.displayName = "SlashIcon";
export { SlashIcon };

const StarIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

StarIcon.displayName = "StarIcon";
export { StarIcon };

const SunIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2V4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 20V22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.92999 4.93L6.33999 6.34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.66 17.66L19.07 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12H4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 12H22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.33999 17.66L4.92999 19.07"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.07 4.93L17.66 6.34"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

SunIcon.displayName = "SunIcon";
export { SunIcon };

const ThreeDotsIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44771 11 4 11.4477 4 12C4 12.5523 4.44771 13 5 13Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

ThreeDotsIcon.displayName = "ThreeDotsIcon";
export { ThreeDotsIcon };

const TrashIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M3 6H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

TrashIcon.displayName = "TrashIcon";
export { TrashIcon };

const UnlockIcon = createIcon({
  Root: Svg,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C6.99876 5.76005 7.45828 4.56387 8.28938 3.64367C9.12047 2.72347 10.2638 2.1449 11.4975 2.02029C12.7312 1.89568 13.9671 2.2339 14.9655 2.96931C15.9638 3.70472 16.6533 4.78485 16.9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

UnlockIcon.displayName = "UnlockIcon";
export { UnlockIcon };
