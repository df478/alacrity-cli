#!/usr/bin/env node

import StdOutUtil from '../utils/StdOutUtil'
import Constants from '../utils/Constants'
import Utils from '../utils/Utils'
import CliHelper from '../utils/CliHelper'
import {
    getErrorForDomain,
    getErrorForPassword,
    getErrorForMachineName
} from '../utils/ValidationsHandler'
import Command, { IOption, IParams, ICommandLineOptions } from './Command'

const K = Utils.extendCommonKeys({
    https: 'hasRootHttps'
})

export default class Login extends Command {
    protected command = 'login'

    protected description =
        'Login to a AlaCrity machine. You can be logged in to multiple machines simultaneously.'

    protected options = (params?: IParams): IOption[] => [
        this.getDefaultConfigFileOption(),
        {
            name: K.https, // Backward compatibility with config hasRootHttps parameter
            hide: true,
            when: false
        },
        {
            name: K.url,
            char: 'u',
            env: 'ALACRITY_URL',
            type: 'input',
            message: `AlaCrity machine URL address, it is "[http[s]://][${Constants.ADMIN_DOMAIN}.]your-alacran-root.domain"`,
            default: params && Constants.SAMPLE_DOMAIN,
            filter: (url: string) =>
                Utils.cleanAdminDomainUrl(
                    url,
                    this.paramValue(params, K.https)
                ) || url, // If not cleaned url, leave url to fail validation with correct error
            validate: (url: string) => getErrorForDomain(url)
        },
        {
            name: K.pwd,
            char: 'p',
            env: 'ALACRITY_PASSWORD',
            type: 'password',
            message: 'AlaCrity machine password',
            validate: (password: string) => getErrorForPassword(password)
        },
        {
            name: K.name,
            char: 'n',
            env: 'ALACRITY_NAME',
            type: 'input',
            message:
                'AlaCrity machine name, with whom the login credentials are stored locally',
            default: params && CliHelper.get().findDefaultAlacranName(),
            filter: (name: string) => name.trim(),
            validate: (name: string) => getErrorForMachineName(name)
        }
    ]

    protected async preAction(
        cmdLineoptions: ICommandLineOptions
    ): Promise<ICommandLineOptions> {
        StdOutUtil.printMessage('Login to a AlaCrity machine...\n')
        return Promise.resolve(cmdLineoptions)
    }

    protected async action(params: IParams): Promise<void> {
        CliHelper.get().loginMachine(
            {
                authToken: '',
                baseUrl: this.findParamValue(params, K.url)!.value,
                name: this.findParamValue(params, K.name)!.value
            },
            this.findParamValue(params, K.pwd)!.value
        )
    }
}
