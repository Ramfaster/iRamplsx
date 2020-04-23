/**
 * 키츠키 발전소 SS 변전소 데이터
 * 
 * @returns
 */
$ ( function ()
{
    var xInterval = 70;
    var yInterval = 20;

    ssData = setTopologyData ( xInterval, yInterval );
} );

function setTopologyData ( x, y )
{
    var xInterval = x;
    var yInterval = y;
    // TODO 프로퍼티로 빼기
    var topologyDataSS1 = [ {
        id : 'root',
        sourceId : 'root',
        label : '특고 연계 변전소',
        x : xInterval * 2,
        y : 0,
    }, {
        id : 'root2',
        sourceId : 'root',
        label : '특고 개폐 소',
        x : xInterval * 2,
        y : yInterval * 0.7,
    }, {
        id : 'SS2',
        sourceId : 'root2',
        x : xInterval * 2.5,
        label : 'SS-2 변전소',
        y : yInterval * 2,
    }, {
        id : 'SS3',
        sourceId : 'root2',
        label : 'SS-3 변전소',
        x : xInterval * 3.5,
        y : yInterval * 2,
    }, {
        id : 'SS4',
        sourceId : 'root2',
        label : 'SS-4 변전소',
        x : xInterval * 4.5,
        y : yInterval * 2,
    }, {
        id : 'INVSB1',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 3,
    }, {
        id : 'VD',
        sourceId : 'INVSB1',
        x : xInterval * 2.2,
        y : yInterval * 3,
        urlIndex : 14
    }, {
        id : 'INVSB16',
        sourceId : 'INVSB1',
        x : xInterval * 2,
        y : yInterval * 4,
        urlIndex : 18
    }, {
        id : 'GDR1',
        sourceId : 'INVSB16',
        x : xInterval * 1,
        y : yInterval * 4,
        urlIndex : 18
    }, {
        id : 'GDR2',
        sourceId : 'INVSB16',
        x : xInterval * 3,
        y : yInterval * 4,
        urlIndex : 19
    }, {
        id : 'VCB',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'TR1',
        sourceId : 'VCB',
        x : xInterval * 2,
        y : yInterval * 6,
        urlIndex : 11
    }, {
        id : 'INVSB17',
        sourceId : 'TR1',
        x : xInterval * 2,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'GDR3',
        sourceId : 'INVSB17',
        x : xInterval * 3,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'VCBF11',
        sourceId : 'TR1',
        x : xInterval * 2.5,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR3',
        sourceId : 'VCBF11',
        x : xInterval * 2.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INVSB2',
        sourceId : 'INCL03',
        x : xInterval * 2.35,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF3',
        sourceId : 'INVSB2',
        x : xInterval * 2.35,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB3',
        sourceId : 'VCBLF3',
        x : xInterval * 2.35,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB4',
        sourceId : 'INVSB3',
        x : xInterval * 1.5,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR2',
        sourceId : 'INVSB4',
        x : xInterval * 1.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL02',
        sourceId : 'VCBR2',
        label : '인클로저-2',
        x : xInterval * 1.5,
        y : yInterval * 10,
    }, {
        id : 'PCS3',
        sourceId : 'INCL02',
        label : 'PCS-3',
        x : xInterval * 1.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS4',
        sourceId : 'PCS3',
        label : 'PCS-4',
        x : xInterval * 1.5,
        y : yInterval * 11,
    }, {
        id : 'INVSB5',
        sourceId : 'INCL02',
        x : xInterval * 1.35,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF2',
        sourceId : 'INVSB5',
        x : xInterval * 1.35,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB6',
        sourceId : 'VCBLF2',
        x : xInterval * 1.35,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB7',
        sourceId : 'INVSB6',
        x : xInterval * 0.5,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR1',
        sourceId : 'INVSB7',
        x : xInterval * 0.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL01',
        sourceId : 'VCBR1',
        label : '인클로저-1',
        x : xInterval * 0.5,
        y : yInterval * 10,
    }, {
        id : 'PCS1',
        sourceId : 'INCL01',
        label : 'PCS-1',
        x : xInterval * 0.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS2',
        sourceId : 'PCS1',
        label : 'PCS-2',
        x : xInterval * 0.5,
        y : yInterval * 11,
    }, {
        id : 'INCL03',
        sourceId : 'VCBR3',
        label : '인클로저-3',
        x : xInterval * 2.5,
        y : yInterval * 10,
    }, {
        id : 'PCS5',
        sourceId : 'INCL03',
        label : 'PCS-5',
        x : xInterval * 2.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS6',
        sourceId : 'PCS6',
        label : 'PCS-6',
        x : xInterval * 2.5,
        y : yInterval * 11,
    }, {
        id : 'VCBFL12',
        sourceId : 'TR1',
        x : xInterval * 5,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR5',
        sourceId : 'VCBFL12',
        x : xInterval * 5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INVSB8',
        sourceId : 'INCL05',
        x : xInterval * 4.85,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF5',
        sourceId : 'INVSB8',
        x : xInterval * 4.85,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB9',
        sourceId : 'VCBLF5',
        x : xInterval * 4.85,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB10',
        sourceId : 'INVSB9',
        x : xInterval * 4,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR4',
        sourceId : 'INVSB10',
        x : xInterval * 4,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL04',
        sourceId : 'VCBR4',
        label : '인클로저-4',
        x : xInterval * 4,
        y : yInterval * 10,
    }, {
        id : 'PCS7',
        sourceId : 'INCL04',
        label : 'PCS-7',
        x : xInterval * 4,
        y : yInterval * 10.5,
    }, {
        id : 'PCS8',
        sourceId : 'PCS7',
        label : 'PCS-8',
        x : xInterval * 4,
        y : yInterval * 11,
    }, {
        id : 'INCL05',
        sourceId : 'VCBR5',
        label : '인클로저-5',
        x : xInterval * 5,
        y : yInterval * 10,
    }, {
        id : 'PCS9',
        sourceId : 'INCL05',
        label : 'PCS-9',
        x : xInterval * 5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS10',
        sourceId : 'PCS9',
        label : 'PCS-10',
        x : xInterval * 5,
        y : yInterval * 11,
    }, {
        id : 'VCBF13',
        sourceId : 'TR1',
        x : xInterval * 6,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR6',
        sourceId : 'VCBF13',
        x : xInterval * 6,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL06',
        sourceId : 'VCBR6',
        label : '인클로저-6',
        x : xInterval * 6,
        y : yInterval * 10,
    }, {
        id : 'PCS11',
        sourceId : 'INCL06',
        label : 'PCS-11',
        x : xInterval * 6,
        y : yInterval * 10.5,
    }, {
        id : 'PCS12',
        sourceId : 'PCS11',
        label : 'PCS-12',
        x : xInterval * 6,
        y : yInterval * 11,
    }, {
        id : 'INVSB11',
        sourceId : 'VCBF13',
        x : xInterval * 6.5,
        y : yInterval * 6,
    }, {
        id : 'INVSB12',
        sourceId : 'INVSB11',
        x : xInterval * 4.5,
        y : yInterval * 6,
    }, {
        id : 'INVSB13',
        sourceId : 'INVSB12',
        x : xInterval * 4.5,
        y : yInterval * 3,
    }, {
        id : 'LBS',
        sourceId : 'INVSB13',
        x : xInterval * 6.2,
        y : yInterval * 3,
        urlIndex : 9
    }, {
        id : 'TR2',
        sourceId : 'LBS',
        x : xInterval * 6.2,
        y : yInterval * 3.8,
        urlIndex : 11
    }, {
        id : 'INVSB14',
        sourceId : 'TR2',
        x : xInterval * 5.5,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH01',
        sourceId : 'INVSB14',
        x : xInterval * 5.1,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH02',
        sourceId : 'INVSB14',
        x : xInterval * 5.3,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH03',
        sourceId : 'INVSB14',
        x : xInterval * 5.5,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH04',
        sourceId : 'INVSB14',
        x : xInterval * 5.7,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'INVSB15',
        sourceId : 'TR2',
        x : xInterval * 6.7,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH05',
        sourceId : 'INVSB15',
        x : xInterval * 6.5,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH06',
        sourceId : 'INVSB15',
        x : xInterval * 6.7,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH07',
        sourceId : 'INVSB15',
        x : xInterval * 6.9,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH08',
        sourceId : 'INVSB15',
        x : xInterval * 7.1,
        y : yInterval * 5,
        urlIndex : 17
    } ];

    var topologyDataSS2 = [ {
        id : 'root',
        label : '특고 연계 변전소',
        x : xInterval * 2,
        y : 0,
    }, {
        id : 'root2',
        sourceId : 'root',
        x : xInterval * 2,
        label : '특고 개폐 소',
        y : yInterval * 0.7,
    }, {
        id : 'SS1',
        sourceId : 'root2',
        x : xInterval * 1.5,
        label : 'SS-1 변전소',
        y : yInterval * 2,
    }, {
        id : 'SS3',
        sourceId : 'root2',
        label : 'SS-3 변전소',
        x : xInterval * 2.5,
        y : yInterval * 2,
    }, {
        id : 'SS4',
        sourceId : 'root2',
        label : 'SS-4 변전소',
        x : xInterval * 3.5,
        y : yInterval * 2,
    }, {
        id : 'INVSB1',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 3,
    }, {
        id : 'VD',
        sourceId : 'INVSB1',
        x : xInterval * 2.2,
        y : yInterval * 3,
        urlIndex : 14
    }, {
        id : 'INVSB2',
        sourceId : 'INVSB1',
        x : xInterval * 2,
        y : yInterval * 4,
    }, {
        id : 'GDR1',
        sourceId : 'INVSB2',
        x : xInterval * 1,
        y : yInterval * 4,
        urlIndex : 18
    }, {
        id : 'GDR2',
        sourceId : 'INVSB2',
        x : xInterval * 3,
        y : yInterval * 4,
        urlIndex : 19
    }, {
        id : 'VCB',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'TR1',
        sourceId : 'VCB',
        x : xInterval * 2,
        y : yInterval * 6,
        urlIndex : 11
    }, {
        id : 'INVSB18',
        sourceId : 'TR1',
        x : xInterval * 2,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'GDR3',
        sourceId : 'INVSB18',
        x : xInterval * 3,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'VCBF11',
        sourceId : 'TR1',
        x : xInterval * 2.5,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR3',
        sourceId : 'VCBF11',
        x : xInterval * 2.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INVSB3',
        sourceId : 'INCL03',
        x : xInterval * 2.35,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF3',
        sourceId : 'INVSB3',
        x : xInterval * 2.35,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB14',
        sourceId : 'VCBLF3',
        x : xInterval * 2.35,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB4',
        sourceId : 'INVSB14',
        x : xInterval * 1.5,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR2',
        sourceId : 'INVSB4',
        x : xInterval * 1.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL02',
        sourceId : 'VCBR2',
        label : '인클로저-2',
        x : xInterval * 1.5,
        y : yInterval * 10,
    }, {
        id : 'PCS3',
        sourceId : 'INCL02',
        label : 'PCS-3',
        x : xInterval * 1.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS4',
        sourceId : 'PCS3',
        label : 'PCS-4',
        x : xInterval * 1.5,
        y : yInterval * 11,
    }, {
        id : 'INVSB5',
        sourceId : 'INCL02',
        x : xInterval * 1.35,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF2',
        sourceId : 'INVSB5',
        x : xInterval * 1.35,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB15',
        sourceId : 'VCBLF2',
        x : xInterval * 1.35,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB6',
        sourceId : 'INVSB15',
        x : xInterval * 0.5,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR1',
        sourceId : 'INVSB6',
        x : xInterval * 0.5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL01',
        sourceId : 'VCBR1',
        label : '인클로저-1',
        x : xInterval * 0.5,
        y : yInterval * 10,
    }, {
        id : 'PCS1',
        sourceId : 'INCL01',
        label : 'PCS-1',
        x : xInterval * 0.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS2',
        sourceId : 'PCS1',
        label : 'PCS-2',
        x : xInterval * 0.5,
        y : yInterval * 11,
    }, {
        id : 'INCL03',
        sourceId : 'VCBR3',
        label : '인클로저-3',
        x : xInterval * 2.5,
        y : yInterval * 10,
    }, {
        id : 'PCS5',
        sourceId : 'INCL03',
        label : 'PCS-5',
        x : xInterval * 2.5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS6',
        sourceId : 'PCS5',
        label : 'PCS-6',
        x : xInterval * 2.5,
        y : yInterval * 11,
    }, {
        id : 'VCBLF12',
        sourceId : 'TR1',
        x : xInterval * 5,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBLR5',
        sourceId : 'VCBLF12',
        x : xInterval * 5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INVSB7',
        sourceId : 'INCL05',
        x : xInterval * 5.15,
        y : yInterval * 9.5,
    }, {
        id : 'VCBF5',
        sourceId : 'INVSB7',
        x : xInterval * 5.15,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB16',
        sourceId : 'VCBF5',
        x : xInterval * 5.15,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB8',
        sourceId : 'INVSB16',
        x : xInterval * 6,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR4',
        sourceId : 'INVSB8',
        x : xInterval * 6,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL04',
        sourceId : 'VCBR4',
        label : '인클로저-4',
        x : xInterval * 6,
        y : yInterval * 10,
    }, {
        id : 'PCS7',
        sourceId : 'INCL04',
        label : 'PCS-7',
        x : xInterval * 6,
        y : yInterval * 10.5,
    }, {
        id : 'PCS8',
        sourceId : 'PCS7',
        label : 'PCS-8',
        x : xInterval * 6,
        y : yInterval * 11,
    }, {
        id : 'INCL05',
        sourceId : 'VCBLR5',
        label : '인클로저-5',
        x : xInterval * 5,
        y : yInterval * 10,
    }, {
        id : 'PCS9',
        sourceId : 'INCL05',
        label : 'PCS-9',
        x : xInterval * 5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS10',
        sourceId : 'PCS9',
        label : 'PCS-10',
        x : xInterval * 5,
        y : yInterval * 11,
    }, {
        id : 'INVSB9',
        sourceId : 'VCBLF12',
        x : xInterval * 6.5,
        y : yInterval * 6,
    }, {
        id : 'INVSB10',
        sourceId : 'INVSB9',
        x : xInterval * 4.5,
        y : yInterval * 6,
    }, {
        id : 'INVSB11',
        sourceId : 'INVSB10',
        x : xInterval * 4.5,
        y : yInterval * 3,
    }, {
        id : 'LBS',
        sourceId : 'INVSB11',
        x : xInterval * 6.2,
        y : yInterval * 3,
        urlIndex : 9
    }, {
        id : 'TR2',
        sourceId : 'LBS',
        x : xInterval * 6.2,
        y : yInterval * 3.8,
        urlIndex : 11
    }, {
        id : 'INVSB12',
        sourceId : 'TR2',
        x : xInterval * 5.5,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH01',
        sourceId : 'INVSB12',
        x : xInterval * 5.1,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH02',
        sourceId : 'INVSB12',
        x : xInterval * 5.3,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH03',
        sourceId : 'INVSB12',
        x : xInterval * 5.5,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH04',
        sourceId : 'INVSB12',
        x : xInterval * 5.7,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'INVSB13',
        sourceId : 'TR2',
        x : xInterval * 6.7,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH05',
        sourceId : 'INVSB13',
        x : xInterval * 6.5,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH06',
        sourceId : 'INVSB13',
        x : xInterval * 6.7,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH07',
        sourceId : 'INVSB13',
        x : xInterval * 6.9,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH08',
        sourceId : 'INVSB13',
        x : xInterval * 7.1,
        y : yInterval * 5,
        urlIndex : 17
    } ];

    var topologyDataSS3 = [ {
        id : 'root',
        sourceId : 'root',
        label : '특고 연계 변전소',
        x : xInterval * 2,
        y : 0,
    }, {
        id : 'root2',
        sourceId : 'root',
        label : '특고 개폐 소',
        x : xInterval * 2,
        y : yInterval * 0.7,
    }, {
        id : 'SS1',
        sourceId : 'root2',
        label : 'SS-1 변전소',
        x : xInterval * 0.5,
        y : yInterval * 2,
    }, {
        id : 'SS2',
        sourceId : 'root2',
        label : 'SS-2 변전소',
        x : xInterval * 1.5,
        y : yInterval * 2,
    }, {
        id : 'SS4',
        sourceId : 'root2',
        label : 'SS-4 변전소',
        x : xInterval * 2.5,
        y : yInterval * 2,
    }, {
        id : 'INVSB1',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 3,
    }, {
        id : 'VD',
        sourceId : 'INVSB1',
        x : xInterval * 2.2,
        y : yInterval * 3,
        urlIndex : 14
    }, {
        id : 'INVSB2',
        sourceId : 'INVSB1',
        x : xInterval * 2,
        y : yInterval * 4,
    }, {
        id : 'GDR1',
        sourceId : 'INVSB2',
        x : xInterval * 1,
        y : yInterval * 4,
        urlIndex : 18
    }, {
        id : 'GDR2',
        sourceId : 'INVSB2',
        x : xInterval * 3,
        y : yInterval * 4,
        urlIndex : 19
    }, {
        id : 'VCB',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'TR1',
        sourceId : 'VCB',
        x : xInterval * 2,
        y : yInterval * 6,
        urlIndex : 11
    }, {
        id : 'INVSB16',
        sourceId : 'TR1',
        x : xInterval * 2,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'GDR3',
        sourceId : 'INVSB16',
        x : xInterval * 3,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'VCBF31',
        sourceId : 'TR1',
        x : xInterval * 0,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR13',
        sourceId : 'VCBF31',
        x : xInterval * 0,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL13',
        sourceId : 'VCBR13',
        label : '인클로저-13',
        x : xInterval * 0,
        y : yInterval * 10,
    }, {
        id : 'PCS25',
        sourceId : 'INCL13',
        label : 'PCS-25',
        x : xInterval * 0,
        y : yInterval * 10.5,
    }, {
        id : 'PCS26',
        sourceId : 'PCS25',
        label : 'PCS-26',
        x : xInterval * 0,
        y : yInterval * 11,
    }, {
        id : 'VCBLF32',
        sourceId : 'TR1',
        x : xInterval * 1.25,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBLR14',
        sourceId : 'VCBLF32',
        x : xInterval * 1.25,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL14',
        sourceId : 'VCBLR14',
        label : '인클로저-14',
        x : xInterval * 1.25,
        y : yInterval * 10,
    }, {
        id : 'PCS27',
        sourceId : 'INCL14',
        label : 'PCS-27',
        x : xInterval * 1.25,
        y : yInterval * 10.5,
    }, {
        id : 'PCS28',
        sourceId : 'PCS27',
        label : 'PCS-28',
        x : xInterval * 1.25,
        y : yInterval * 11,
    }, {
        id : 'INVSB3',
        sourceId : 'INCL14',
        x : xInterval * 1.4,
        y : yInterval * 9.5,
    }, {
        id : 'VCBF142',
        sourceId : 'INVSB3',
        x : xInterval * 1.4,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB4',
        sourceId : 'VCBF142',
        x : xInterval * 1.4,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB5',
        sourceId : 'INVSB4',
        x : xInterval * 3,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR16',
        sourceId : 'INVSB5',
        x : xInterval * 3,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL16',
        sourceId : 'VCBR16',
        label : '인클로저-16',
        x : xInterval * 3,
        y : yInterval * 10,
    }, {
        id : 'PCS31',
        sourceId : 'INCL16',
        label : 'PCS-31',
        x : xInterval * 3,
        y : yInterval * 10.5,
    }, {
        id : 'PCS32',
        sourceId : 'PCS31',
        label : 'PCS-32',
        x : xInterval * 3,
        y : yInterval * 11,
    }, {
        id : 'INVSB6',
        sourceId : 'INVSB3',
        x : xInterval * 2,
        y : yInterval * 9.25,
    }, {
        id : 'VCBF141',
        sourceId : 'INVSB6',
        x : xInterval * 2,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB7',
        sourceId : 'VCBF141',
        x : xInterval * 2.3,
        y : yInterval * 8.5,
    }, {
        id : 'VCBR15',
        sourceId : 'INVSB7',
        x : xInterval * 2.3,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL15',
        sourceId : 'VCBR15',
        label : '인클로저-15',
        x : xInterval * 2.3,
        y : yInterval * 10,
    }, {
        id : 'PCS29',
        sourceId : 'INCL15',
        label : 'PCS-29',
        x : xInterval * 2.3,
        y : yInterval * 10.5,
    }, {
        id : 'PCS30',
        sourceId : 'PCS29',
        label : 'PCS-30',
        x : xInterval * 2.3,
        y : yInterval * 11,
    }, {
        id : 'VCBLF33',
        sourceId : 'TR1',
        x : xInterval * 4,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBLR17',
        sourceId : 'VCBLF33',
        x : xInterval * 4,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL17',
        sourceId : 'VCBLR17',
        label : '인클로저-17',
        x : xInterval * 4,
        y : yInterval * 10,
    }, {
        id : 'PCS33',
        sourceId : 'INCL17',
        x : xInterval * 4,
        y : yInterval * 10.5,
    }, {
        id : 'PCS34',
        sourceId : 'PCS33',
        x : xInterval * 4,
        y : yInterval * 11,
    }, {
        id : 'INVSB8',
        sourceId : 'INCL17',
        x : xInterval * 4.15,
        y : yInterval * 9.5,
    }, {
        id : 'VCBF147',
        sourceId : 'INVSB8',
        x : xInterval * 4.15,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB9',
        sourceId : 'VCBF147',
        x : xInterval * 4.15,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB10',
        sourceId : 'INVSB9',
        x : xInterval * 5,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR18',
        sourceId : 'INVSB10',
        x : xInterval * 5,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL18',
        sourceId : 'VCBR18',
        label : '인클로저-18',
        x : xInterval * 5,
        y : yInterval * 10,
    }, {
        id : 'PCS35',
        sourceId : 'INCL18',
        label : 'PCS-35',
        x : xInterval * 5,
        y : yInterval * 10.5,
    }, {
        id : 'PCS36',
        sourceId : 'PCS35',
        label : 'PCS-36',
        x : xInterval * 5,
        y : yInterval * 11,
    }, {
        id : 'INVSB11',
        sourceId : 'VCBLF33',
        x : xInterval * 4.8,
        y : yInterval * 6,
    }, {
        id : 'INVSB12',
        sourceId : 'INVSB11',
        x : xInterval * 3.2,
        y : yInterval * 6,
    }, {
        id : 'INVSB13',
        sourceId : 'INVSB12',
        x : xInterval * 3.2,
        y : yInterval * 3,
    }, {
        id : 'LBS',
        sourceId : 'INVSB13',
        x : xInterval * 4.5,
        y : yInterval * 3,
        urlIndex : 9
    }, {
        id : 'TR2',
        sourceId : 'LBS',
        x : xInterval * 4.5,
        y : yInterval * 3.8,
        urlIndex : 11
    }, {
        id : 'INVSB14',
        sourceId : 'TR2',
        x : xInterval * 4,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH01',
        sourceId : 'INVSB14',
        x : xInterval * 3.6,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH02',
        sourceId : 'INVSB14',
        x : xInterval * 3.8,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH03',
        sourceId : 'INVSB14',
        x : xInterval * 4,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH04',
        sourceId : 'INVSB14',
        x : xInterval * 4.2,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'INVSB15',
        sourceId : 'TR2',
        x : xInterval * 5.2,
        y : yInterval * 4.2,
    }, {
        id : 'SWTCH05',
        sourceId : 'INVSB15',
        x : xInterval * 5,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH06',
        sourceId : 'INVSB15',
        x : xInterval * 5.2,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH07',
        sourceId : 'INVSB15',
        x : xInterval * 5.4,
        y : yInterval * 5,
        urlIndex : 17
    }, {
        id : 'SWTCH08',
        sourceId : 'INVSB15',
        x : xInterval * 5.6,
        y : yInterval * 5,
        urlIndex : 17
    } ];

    var topologyDataSS4 = [ {
        id : 'root',
        sourceId : 'root',
        label : '특고 연계 변전소',
        x : xInterval * 2,
        y : 0,
    }, {
        id : 'root2',
        sourceId : 'root',
        label : '특고 개폐 소',
        x : xInterval * 2,
        y : yInterval * 0.7,
    }, {
        id : 'SS1',
        sourceId : 'root2',
        label : 'SS-1 변전소',
        x : xInterval * 0,
        y : yInterval * 2,
    }, {
        id : 'SS2',
        sourceId : 'root2',
        label : 'SS-2 변전소',
        x : xInterval * 0.75,
        y : yInterval * 2,
    }, {
        id : 'SS3',
        sourceId : 'root2',
        label : 'SS-3 변전소',
        x : xInterval * 1.5,
        y : yInterval * 2,
    }, {
        id : 'INVSB14',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 3,
    }, {
        id : 'VD',
        sourceId : 'INVSB14',
        x : xInterval * 2.2,
        y : yInterval * 3,
        urlIndex : 14
    }, {
        id : 'INVSB141',
        sourceId : 'INVSB14',
        x : xInterval * 2,
        y : yInterval * 4,
    }, {
        id : 'GDR1',
        sourceId : 'INVSB141',
        x : xInterval * 1,
        y : yInterval * 4,
        urlIndex : 18
    }, {
        id : 'GDR2',
        sourceId : 'INVSB141',
        x : xInterval * 3,
        y : yInterval * 4,
        urlIndex : 19
    }, {
        id : 'VCB',
        sourceId : 'root2',
        x : xInterval * 2,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'TR1',
        sourceId : 'VCB',
        x : xInterval * 2,
        y : yInterval * 6,
        urlIndex : 11
    }, {
        id : 'INVSB7',
        sourceId : 'TR1',
        x : xInterval * 2,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'GDR3',
        sourceId : 'INVSB7',
        x : xInterval * 3,
        y : yInterval * 6.5,
        urlIndex : 0
    }, {
        id : 'VCBF41',
        sourceId : 'TR1',
        x : xInterval * 1,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR7',
        sourceId : 'VCBF41',
        x : xInterval * 1,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL7',
        sourceId : 'VCBR7',
        label : '인클로저-7',
        x : xInterval * 1,
        y : yInterval * 10,
    }, {
        id : 'PCS13',
        sourceId : 'INCL7',
        label : 'PCS-13',
        x : xInterval * 1,
        y : yInterval * 10.5,
    }, {
        id : 'PCS14',
        sourceId : 'PCS13',
        label : 'PCS-14',
        x : xInterval * 1,
        y : yInterval * 11,
    }, {
        id : 'INVSB1',
        sourceId : 'INCL7',
        x : xInterval * 0.85,
        y : yInterval * 9.5,
    }, {
        id : 'VCBLF7',
        sourceId : 'INVSB1',
        x : xInterval * 0.85,
        y : yInterval * 8.5,
        urlIndex : 8
    }, {
        id : 'INVSB32',
        sourceId : 'VCBLF7',
        x : xInterval * 0.85,
        y : yInterval * 7.7,
    }, {
        id : 'INVSB3',
        sourceId : 'INVSB32',
        x : xInterval * 0,
        y : yInterval * 7.7,
    }, {
        id : 'VCBR19',
        sourceId : 'INVSB3',
        x : xInterval * 0,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL19',
        sourceId : 'VCBR19',
        label : '인클로저-19',
        x : xInterval * 0,
        y : yInterval * 10,
    }, {
        id : 'PCS37',
        sourceId : 'INCL19',
        label : 'PCS-37',
        x : xInterval * 0,
        y : yInterval * 10.5,
    }, {
        id : 'PCS38',
        sourceId : 'PCS37',
        label : 'PCS-38',
        x : xInterval * 0,
        y : yInterval * 11,
    }, {
        id : 'VCBF42',
        sourceId : 'TR1',
        x : xInterval * 2.25,
        y : yInterval * 8,
        urlIndex : 8
    }, {
        id : 'VCBR71',
        sourceId : 'VCBF42',
        x : xInterval * 2.25,
        y : yInterval * 9,
        urlIndex : 8
    }, {
        id : 'INCL71',
        sourceId : 'VCBR71',
        label : '인클로저-7',
        x : xInterval * 2.25,
        y : yInterval * 10,
    }, {
        id : 'PCS131',
        sourceId : 'INCL71',
        label : 'PCS-131',
        x : xInterval * 2.25,
        y : yInterval * 10.5,
    }, {
        id : 'PCS141',
        sourceId : 'PCS131',
        label : 'PCS-141',
        x : xInterval * 2.25,
        y : yInterval * 11,
    }, {
        id : 'LBS',
        sourceId : 'TR1',
        x : xInterval * 5,
        y : yInterval * 8,
        urlIndex : 9
    }, {
        id : 'TR2',
        sourceId : 'LBS',
        x : xInterval * 5,
        y : yInterval * 8.8,
        urlIndex : 11
    }, {
        id : 'INVSB4',
        sourceId : 'TR2',
        x : xInterval * 4,
        y : yInterval * 9.2,
    }, {
        id : 'SWTCH01',
        sourceId : 'INVSB4',
        x : xInterval * 3.6,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH02',
        sourceId : 'INVSB4',
        x : xInterval * 3.8,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH03',
        sourceId : 'INVSB4',
        x : xInterval * 4,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH04',
        sourceId : 'INVSB4',
        x : xInterval * 4.2,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'INVSB5',
        sourceId : 'TR2',
        x : xInterval * 6.2,
        y : yInterval * 9.2,
    }, {
        id : 'SWTCH05',
        sourceId : 'INVSB5',
        x : xInterval * 6,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH06',
        sourceId : 'INVSB5',
        x : xInterval * 6.2,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH07',
        sourceId : 'INVSB5',
        x : xInterval * 6.4,
        y : yInterval * 10,
        urlIndex : 17
    }, {
        id : 'SWTCH08',
        sourceId : 'INVSB5',
        x : xInterval * 6.6,
        y : yInterval * 10,
        urlIndex : 17
    } ];

    var ssData = {
        ss1 : topologyDataSS1,
        ss2 : topologyDataSS2,
        ss3 : topologyDataSS3,
        ss4 : topologyDataSS4
    }

    return ssData;
}
