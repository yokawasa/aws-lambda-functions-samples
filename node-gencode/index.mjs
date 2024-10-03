export const handler = async (event) => {
    try {
        // ログで event オブジェクトを確認（デバッグ用）
        console.log('Received event:', JSON.stringify(event));

        // HTTP メソッドが POST であることを確認
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405, // Method Not Allowed
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        // リクエストボディが存在するか確認
        if (!event.body) {
            return {
                statusCode: 400, // Bad Request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Request body is missing.' }),
            };
        }

        // リクエストボディをパース
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            return {
                statusCode: 400, // Bad Request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Invalid JSON format.' }),
            };
        }

        let id = body.id;

        // 'id' が文字列であることを確認
        if (typeof id !== 'string') {
            return {
                statusCode: 400, // Bad Request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Invalid id format. Expected a string.' }),
            };
        }

        // 'id' に含まれるアルファベットの大文字を小文字に変換
        id = id.toLowerCase();

        // 'id' 文字列を基に 5 桁の数値を生成するアルゴリズム
        // ここでは、SHA-256 ハッシュを使用し、最初の5桁を取り出す方法を採用
        const crypto = await import('crypto');
        const hash = crypto.createHash('sha256').update(id).digest('hex');
        // 16進数のハッシュを10進数に変換し、5桁に調整
        const numericHash = BigInt('0x' + hash) % 100000n;
        const fiveDigitNumber = numericHash.toString().padStart(5, '0');

        // 5 桁の数値をレスポンスとして返す
        return {
            statusCode: 200, // OK
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: fiveDigitNumber }),
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500, // Internal Server Error
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

