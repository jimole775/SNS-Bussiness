/**
 * �豸ָ����ڣ���APP�˽�������
 * @varAction number :�˿ںţ��ֽ׶�û��ʲô���壬��������
 * @varRecvData number :�������͵��ַ���������16����
 *                     :һ���յ���ָ�������� 009B��ͷ�� 5104��ͷ�� 7109��ͷ
 *                     :�յ��豸��ָ��֮�󣬻��ȡǰ4λ��Ȼ����� ��Fun7109�� ����ʽ��
 *                     :ͨ�� win.devService["Fun7109"] ����ʽ�����Ѿ�����õĺ�����Ȼ���ٽ��о����ҵ�����
 * */
win.jsRecvDeviceData = function (varAction, varRecvData) {};

/**
 * ҵ�����������
 * 7109����ָ��ķ����߼�
 * �����ɵĺ��������� window.devService.Fun710901() ,
 * ��Щ�����Ѿ���ҵ��������涨��ã�
 * ���ڵĲ����൱�ڰ��豸ָ���һ��������
 * */
win.devService.Fun7109 = function (varRecvData) {
    var cmdStr = varRecvData.substr(0, 6);
    var _func = "";
    switch (cmdStr) {
        case "710901": 	//����OBDϵͳ
        case "710981":	//����OBDʧ��

        case "710905":	//��ʷ������
        case "710906":	//��ǰ������
        case "710914":	//��״̬�Ĺ�����

        case "710985":	//û����ʷ������
        case "710986":	//û�е�ǰ������
        case "710994":	//û�д�״̬�Ĺ�����

        case "710902":	//�Ͽ�OBDϵͳ�ɹ�
        case "710982":	//�Ͽ�OBDϵͳʧ��

        case "710907":	//���������ɹ�
        case "710987":  //���������ʧ��

            //��Ҫע����ǣ���������ҵ����Ҫ�����ֶ���רҵ���������Զ������ף�����
            //Ҳ�����ڡ�Fun710901���������һ����ʶ��_pro�� ��_simp��
            //�ֶ���רҵ����ϣ�Fun710901_pro
            //�Զ������ף���ϣ�Fun710901_simp
            if (global.businessInfo.diagType) {_func = "Fun" + cmdStr + "_" + global.businessInfo.diagType;}
            else { _func = "Fun" + cmdStr }
            break;
        default :
            _func = "Fun" + cmdStr;
            break;
    }

    //���ƴװ����
    var func = win.devService[_func];

    if (func instanceof Function) func(varRecvData);
};