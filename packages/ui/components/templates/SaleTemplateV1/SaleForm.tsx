import { useRef } from "react";
import {
  chakra,
  Button,
  Flex,
  Tooltip,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
  AlertIcon,
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Stack,
  Divider,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { ExternalLinkIcon, QuestionIcon } from "@chakra-ui/icons";
import { useQuery } from "@apollo/client";
import { DateRangePicker } from "rsuite";
import { FormikProps } from "formik";
import { differenceInSeconds, format } from "date-fns";
import { BigNumber, ethers } from "ethers";
import {
  getDecimalsForView,
  getEtherscanLink,
  tokenAmountFormat,
} from "lib/utils";
import Big, { divide, getBigNumber, multiply } from "lib/utils/bignumber";
import { SaleForm, Template } from "lib/types/Sale";
import { CHAIN_NAMES } from "lib/constants";
import { LIST_TEMPLATE_QUERY } from "lib/apollo/query";
import { useLocale } from "../../../hooks/useLocale";

export default function SaleForm({
  formikProps,
  address,
  approvals,
  writeFn,
  tokenData,
  balance,
}: {
  formikProps: FormikProps<SaleForm>;
  address: `0x${string}`;
  approvals: any;
  writeFn: any;
  tokenData: any;
  balance?: BigNumber | undefined;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef<HTMLFormElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data, loading, error, refetch } = useQuery(LIST_TEMPLATE_QUERY);
  const { t } = useLocale();

  return (
    <div>
      <form ref={containerRef} onSubmit={formikProps.handleSubmit}>
        <FormControl
          isInvalid={
            !!formikProps.errors.templateName &&
            !!formikProps.touched.templateName
          }
        >
          <FormLabel htmlFor="token" alignItems={"baseline"}>
            {t("SELECT_SALE_TEMPLETE")}
            <Tooltip hasArrow label={t("YOU_CAN_CHOOSE_THE_TYPE_OF_TOKEN_SALE")}>
              <QuestionIcon mb={1} ml={1} />
            </Tooltip>
          </FormLabel>
          <Select
            isDisabled={true}
            id="templateName"
            name="templateName"
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            value={formikProps.values.templateName}
          >
            {!data && (
              <option value="">
                <Spinner />
              </option>
            )}
            {data &&
              data.templates.map((template: Template) => (
                <option key={template.id} value={template.templateName}>
                  {ethers.utils.parseBytes32String(template.templateName)}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{formikProps.errors.templateName}</FormErrorMessage>
        </FormControl>

        <FormControl
          mt={4}
          isInvalid={!!formikProps.errors.token && !!formikProps.touched.token}
        >
          <FormLabel htmlFor="token" alignItems={"baseline"}>
            {t("TOKEN_ADDRESS")}
            <Tooltip
              hasArrow
              label={t("INPUT_THE_ADDRESS_OF_THE_TOKEN_YOU_WOULD_LIKE_TO_ALLOCATE_TO_THIS_SALE")}
            >
              <QuestionIcon mb={1} ml={1} />
            </Tooltip>
          </FormLabel>
          <Input
            id="token"
            name="token"
            onBlur={formikProps.handleBlur}
            onChange={(event: React.ChangeEvent<any>) => {
              formikProps.setFieldTouched("allocatedAmount");
              formikProps.handleChange(event);
            }}
            value={formikProps.values.token ? formikProps.values.token : ""}
            placeholder="e.g. 0x0123456789012345678901234567890123456789"
          />
          <FormErrorMessage>{formikProps.errors.token}</FormErrorMessage>
        </FormControl>

        <chakra.p color={"gray.400"} fontSize={"sm"} mt={1}>
          {t("DONT_HAVE_A_TOKEN_YET")}{" "}
          <Link
            color={"gray.300"}
            href="https://www.smartcontracts.tools/token-generator/ethereum/"
            target="_blank"
          >
            ETHEREUM Token Generator <ExternalLinkIcon />
          </Link>
        </chakra.p>

        <FormControl
          mt={4}
          isInvalid={
            (!!formikProps.errors.startingAt &&
              !!formikProps.touched.startingAt) ||
            (!!formikProps.errors.eventDuration &&
              !!formikProps.touched.eventDuration)
          }
        >
          <FormLabel alignItems={"baseline"}>
            {t("START_DATE_END_DATE")}
            <Tooltip
              hasArrow
              label={t("INPUT_THE_DURATION_OF_THE_TOKEN_SALE")}
            >
              <QuestionIcon mb={1} ml={1} />
            </Tooltip>
          </FormLabel>
          <DateRangePicker
            onEnter={() => {
              formikProps.setTouched({ startingAt: true, eventDuration: true });
              setTimeout(formikProps.validateForm, 200);
            }}
            onBlur={(value: any) => {
              setTimeout(formikProps.validateForm, 200);
            }}
            onChange={(value: any) => {
              if (!value) return;
              const start = value[0];
              const end = value[1];
              if (!start || !end) return;
              const duration = differenceInSeconds(end, start);
              formikProps.setFieldValue("startingAt", start.getTime());
              formikProps.setFieldValue("eventDuration", duration);
              setTimeout(formikProps.validateForm, 200);
            }}
            onOk={(value: any) => {
              if (!value) return;
              const start = value[0];
              const end = value[1];
              if (!start || !end) return;
              const duration = differenceInSeconds(end, start);
              formikProps.setFieldValue("startingAt", start.getTime());
              formikProps.setFieldValue("eventDuration", duration);
              setTimeout(formikProps.validateForm, 200);
            }}
            format="yyyy-MM-dd HH:mm:ss"
            cleanable={false}
            defaultValue={[
              new Date(formikProps.values.startingAt),
              new Date(
                formikProps.values.startingAt +
                  formikProps.values.eventDuration * 1000
              ),
            ]}
          />
          <chakra.span fontSize={"sm"} ml={2}>
            ({format(0, "z")})
          </chakra.span>
          <FormErrorMessage>{formikProps.errors.startingAt}</FormErrorMessage>
          <FormErrorMessage>
            {formikProps.errors.eventDuration}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mt={4}
          isInvalid={
            !!formikProps.errors.allocatedAmount &&
            !!formikProps.touched.allocatedAmount
          }
        >
          <Flex justifyContent={"space-between"}>
            <FormLabel alignItems={"baseline"}>
              {t("ALLOCATION_TO_THE_SALE")}
              <Tooltip
                hasArrow
                label={t("INPUT_THE_AMOUNT_OF_TOKENS_TO_BE_ALLOCATED")}
              >
                <QuestionIcon mb={1} ml={1} />
              </Tooltip>
            </FormLabel>
          </Flex>

          <Flex alignItems={"center"}>
            <NumberInput
              flex="1"
              name="allocatedAmount"
              value={formikProps.values.allocatedAmount}
              min={0}
              max={Number.MAX_SAFE_INTEGER}
              onBlur={formikProps.handleBlur}
              onChange={(strVal: string, val: number) =>
                formikProps.setFieldValue(
                  "allocatedAmount",
                  strVal && Number(strVal) === val
                    ? strVal
                    : isNaN(val)
                    ? 0
                    : val
                )
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <chakra.div px={2} minW={"3rem"}>
              {tokenData?.symbol}
            </chakra.div>
          </Flex>
          <chakra.p color={"gray.400"} fontSize={"sm"}>
            {t("BALANCE")}:{" "}
            {balance && tokenData
              ? tokenAmountFormat(
                  Big(balance.toString()),
                  tokenData.decimals,
                  getDecimalsForView(
                    getBigNumber(tokenData.totalSupply.value.toString()),
                    tokenData.decimals
                  )
                )
              : "-"}{" "}
            {tokenData?.symbol}
          </chakra.p>
          <FormErrorMessage>
            {formikProps.errors.allocatedAmount}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mt={4}
          isInvalid={
            !!formikProps.errors.minRaisedAmount &&
            !!formikProps.touched.minRaisedAmount
          }
        >
          <FormLabel alignItems={"baseline"}>
            {t("MINIMUM_TOTAL_RAISED")}
            <Tooltip
              hasArrow
              label={t("THE_SALE_WILL_BE_VOID_IF_THE_TOTAL_RAISED_IS_LESS_THAN_THIS_THRESHOLD")}
            >
              <QuestionIcon mb={1} ml={1} />
            </Tooltip>
          </FormLabel>
          <Flex alignItems={"center"}>
            <NumberInput
              flex="1"
              name="minRaisedAmount"
              value={formikProps.values.minRaisedAmount}
              step={0.01}
              min={0}
              max={10000000}
              onBlur={formikProps.handleBlur}
              onChange={(strVal: string, val: number) =>
                formikProps.setFieldValue(
                  "minRaisedAmount",
                  strVal && Number(strVal) === val
                    ? strVal
                    : isNaN(val)
                    ? 0
                    : val
                )
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <chakra.div px={2}>ETH</chakra.div>
          </Flex>
          <chakra.p color={"gray.400"} fontSize={"sm"}>
            {!!tokenData && !!formikProps.values.minRaisedAmount && !!formikProps.values.allocatedAmount
              && `1 ${tokenData.symbol} = ${divide(
                formikProps.values.minRaisedAmount,
                formikProps.values.allocatedAmount
                ).toString()} ETH at Minimum total raised`
              }
          </chakra.p>
          <FormErrorMessage>
            {formikProps.errors.minRaisedAmount}
          </FormErrorMessage>
        </FormControl>
        {approvals.allowance &&
        Big(approvals.allowance).gte(
          multiply(
            Big(formikProps.values.allocatedAmount.toString()),
            Big(10).pow(tokenData ? tokenData.decimals : 0)
          )
        ) ? (
          <>
            <Button
              mt={8}
              w={"full"}
              variant="solid"
              colorScheme="green"
              isLoading={writeFn.isLoading}
              isDisabled={!writeFn.writeAsync || !formikProps.isValid}
              onClick={onOpen}
            >
              {t("DEPLOY_SALE_CONTRACT")}
            </Button>
            <AlertDialog
              isOpen={isOpen}
              size={"lg"}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              closeOnOverlayClick={false}
              portalProps={{ containerRef: containerRef }}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {t("CONFIRMATION")}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    <Stack spacing={4} divider={<Divider />}>
                      <div>
                        <chakra.p>{t("SELECT_SALE_TEMPLETE")}</chakra.p>
                        <chakra.p
                          fontWeight={"bold"}
                          aria-label="Sale Template"
                        >
                          {ethers.utils.parseBytes32String(
                            formikProps.values.templateName
                          )}
                        </chakra.p>
                      </div>

                      <div>
                        <chakra.p>{t("TOKEN_ADDRESS")}</chakra.p>
                        <chakra.p
                          fontWeight={"bold"}
                          aria-label="Token address"
                        >
                          <Link
                            href={getEtherscanLink(
                              CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID!],
                              formikProps.values.token as `0x${string}`,
                              "token"
                            )}
                            target={"_blank"}
                          >
                            {formikProps.values.token}
                            <ExternalLinkIcon ml={1} />
                          </Link>
                        </chakra.p>
                      </div>

                      <div>
                        <chakra.p>{t("START_DATE_END_DATE")}</chakra.p>
                        <chakra.p
                          fontWeight={"bold"}
                          aria-label="Start date - End date"
                        >
                          <>
                            {format(
                              formikProps.values.startingAt,
                              "yyyy/MM/dd HH:mm:ss"
                            )}
                            {` - `}
                            {format(
                              formikProps.values.startingAt +
                                formikProps.values.eventDuration * 1000,
                              "yyyy/MM/dd HH:mm:ss"
                            )}{" "}
                            {format(new Date(), "(z)")}
                          </>
                        </chakra.p>
                      </div>

                      <div>
                        <chakra.p>{t("ALLOCATED_TO_THE_SALE")}</chakra.p>
                        <chakra.p
                          fontWeight={"bold"}
                          aria-label="Allocated to the sale"
                        >
                          {tokenData
                            ? Number(
                                formikProps.values.allocatedAmount
                              ).toFixed(
                                getDecimalsForView(
                                  getBigNumber(
                                    tokenData?.totalSupply.value.toString()
                                  ),
                                  tokenData?.decimals
                                )
                              )
                            : "-"}{" "}
                          {tokenData?.symbol}
                        </chakra.p>
                      </div>

                      <div>
                        <chakra.p>{t("MINIMUM_TOTAL_RAISED")}</chakra.p>
                        <chakra.p
                          fontWeight={"bold"}
                          aria-label="Minimum total raised"
                        >
                          {Number(formikProps.values.minRaisedAmount).toFixed(
                            2
                          )}{" "}
                          ETH
                        </chakra.p>
                      </div>
                    </Stack>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      {t("CANCEL")}
                    </Button>
                    <Button
                      ml={4}
                      type="submit"
                      variant="solid"
                      colorScheme="green"
                      isLoading={writeFn.isLoading}
                      isDisabled={!writeFn.writeAsync || !formikProps.isValid}
                    >
                      {t("DEPLOY_SALE_CONTRACT")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        ) : (
          <Button
            mt={8}
            w={"full"}
            variant="solid"
            colorScheme="blue"
            onClick={approvals.writeFn.write}
            isLoading={
              approvals.writeFn.isLoading || approvals.waitFn.isLoading
            }
            isDisabled={!approvals.writeFn.write || !formikProps.isValid}
          >
            {t("APPROVE_TOKEN")}
          </Button>
        )}
      </form>
    </div>
  );
}
