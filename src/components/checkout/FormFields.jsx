// COMPONENTS
import {
  Field,
  Label,
  Input,
  Checkbox,
  Button,
  RadioGroup,
  Radio,
} from "@headlessui/react";
import {
  MdOutlineAdd,
  MdOutlineRemove,
  MdOutlineDelete,
  MdOutlineError,
  MdOutlineCheck,
} from "react-icons/md";

// FUNCTIONS
import { useState, useEffect } from "react";
import { useTickets } from "@/store/TicketStore";

// NUMBER SPINNER
export function QuantitySelector({ data, children }) {
  return (
    <Field className="peer grid grid-cols-[auto_1rem_1fr] @md:grid-cols-[1fr_auto_1.5rem] items-end justify-between gap-2 gap-x-4 @md:gap-4">
      <Label className="col-span-full @md:col-span-1 body-copy flex justify-between gap-12">
        {children}
        <span className="body-copy opacity-50 place-self-end mr-8">
          {data.price} DKK
        </span>
      </Label>
      <Spinner {...data} />
    </Field>
  );
}

function Spinner({
  name,
  error,
  disabled,
  currentTotal,
  setTotal,
  overallTotal,
}) {
  const [quantity, setQuantity] = useState(currentTotal);
  const { partoutTickets, vipTickets } = useTickets();
  const totalGuests = partoutTickets + vipTickets;

  useEffect(() => {
    setTotal(quantity);
  }, [quantity]);

  return (
    <>
      <div
        className={`input-field input-field-number--focus flex justify-between gap-4 w-fit ${
          ((error?.includes("select") && overallTotal < 1) ||
            (error?.includes("limit") &&
              overallTotal > 10 &&
              overallTotal !== 0) ||
            (error?.includes("space") &&
              overallTotal !== 0 &&
              overallTotal !== totalGuests)) &&
          "not-has-data-focus:border-border-global--error bg-surface-input--focus"
        }`}
      >
        <Button
          aria-label="Decrease"
          disabled={!quantity}
          className="data-disabled:opacity-25 not-data-disabled:cursor-pointer"
          onClick={() => setQuantity(Number(quantity) - 1)}
        >
          <MdOutlineRemove className="text-text-global" size="24" />
        </Button>
        <Input
          type="number"
          name={name}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="body-copy w-6 text-center data-focus:outline-none data-disabled:text-text-global/15"
        />
        <Button
          aria-label="Increase"
          disabled={disabled}
          className="data-disabled:opacity-25 not-data-disabled:cursor-pointer"
          onClick={() => setQuantity(Number(quantity) + 1)}
        >
          <MdOutlineAdd className="text-text-global" size="24" />
        </Button>
      </div>
      {quantity > 0 && (
        <Button
          aria-label="Clear"
          className="cursor-pointer"
          onClick={() => setQuantity(0)}
        >
          <MdOutlineDelete
            className="hover:opacity-50 opacity-25 place-self-center hidden @md:block"
            size="24"
          />
        </Button>
      )}
      {error?.includes("select") && overallTotal < 1 && (
        <MdOutlineError
          aria-label="Attention!"
          className="place-self-center text-text-global--error error_icon"
          size="24"
        />
      )}
    </>
  );
}

// RADIO GROUP
export function RadioSelector({ data, selected, setSelected }) {
  return (
    <RadioGroup name="area" value={selected} onChange={setSelected}>
      {data.map((option, id) => (
        <Field
          key={id}
          disabled={option.disabled}
          className="flex items-end justify-between max-w-xl gap-6 md:gap-8 not-data-disabled:cursor-pointer"
        >
          <Radio
            value={option.label}
            className="group grid grid-cols-[auto_8rem_4rem] gap-3 items-center"
          >
            <span className="input-radio" />
            <Label className="body-copy group-data-disabled:opacity-25 group-not-data-disabled:cursor-pointer">
              {option.label}
            </Label>
            <small className="body-copy-small opacity-50 cursor-default justify-self-end">
              {option.details}
            </small>
          </Radio>
        </Field>
      ))}
    </RadioGroup>
  );
}

// CHECKBOX
export function CheckField({ data, state, children }) {
  const [checked, setChecked] = useState(state || false);
  return (
    <Field className="flex items-center gap-2 md:gap-3 max-w-xl group">
      <Checkbox
        name={data?.name}
        checked={data?.state || checked}
        onChange={data?.onChange || setChecked}
        className="input-checkbox"
      >
        <MdOutlineCheck className="opacity-0 group-has-data-checked:opacity-100" />
      </Checkbox>
      <Label className="body-copy-small md:text-res-base text-aztec-300 flex justify-between group-data-disabled:opacity-25 group-not-data-disabled:cursor-pointer">
        {children}{" "}
        {data?.price && (
          <span className="opacity-50 place-self-end ml-8">
            {data?.price} DKK
          </span>
        )}
      </Label>
    </Field>
  );
}

// CUSTOMER FIELD
export function CustomerField({
  name,
  defaultValue,
  placeholder,
  error,
  errorIcon,
  errorText,
  children,
}) {
  const errorStyle =
    "not-data-focus:border-border-global--error bg-surface-input--focus";
  return (
    <Field className="grid gap-y-2">
      <Label className="body-copy">{children}</Label>
      <div className={errorIcon && "grid grid-cols-[6fr_1fr] gap-x-4"}>
        <Input
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`input-field input-field-text--focus cursor-auto body-copy placeholder:text-res-sm ${
            error && errorStyle
          }`}
        />
        {error && errorIcon && (
          <MdOutlineError
            aria-label="Attention!"
            className="mr-4 place-self-center text-text-global--error"
            size="24"
          />
        )}
      </div>
      {error && errorText && <ErrorText>{error}</ErrorText>}
    </Field>
  );
}

// TEXT INPUT
export function TextInput({
  name,
  type,
  placeholder,
  defaultValue,
  error,
  children,
  variant,
}) {
  const variants = {
    fullSpan: "col-span-3",
    twoSpan: "col-span-2",
  };
  return (
    <Field
      className={`grid gap-y-2 ${variant ? variants[variant] : "max-w-sm"}`}
    >
      <Label
        className={`body-copy capitalize ${variant === "slim" && "opacity-65"}`}
      >
        {children}
      </Label>
      <div
        className={`grid ${
          variant !== "twoSpan" && "grid-cols-[1fr_auto]"
        } gap-y-4 relative`}
      >
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`input-field input-field-text--focus body-copy placeholder:text-res-sm ${
            variant === "slim" && "py-1"
          } ${
            error &&
            !defaultValue &&
            "not-data-focus:border-border-global--error bg-surface-input--focus"
          }`}
        />
        {variant !== "twoSpan" && (
          <div className="w-6 hidden md:block">
            {error && !defaultValue && variant !== "slim" && (
              <MdOutlineError
                aria-label="Attention!"
                className="mr-4place-self-center text-text-global--error"
                size="24"
              />
            )}
          </div>
        )}
      </div>
      {(variant != "slim" || variant != "twoSpan") && (
        <ErrorText>{!error?.includes("ticket") && error}</ErrorText>
      )}
    </Field>
  );
}

// ERROR TEXT
export function ErrorText({ children }) {
  return (
    <small className="body-copy-small text-red-200 italic">{children}</small>
  );
}
