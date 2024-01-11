# 1. 创建 adminuser 访问 dashboard

```bash
kubectl apply -f adminuser.yaml

# 生成token, 默认1个小时有效期
kubectl create token admin-user

# 生成长久Token, 必须创建Secret
kubectl get secret admin-user -o jsonpath={".data.token"} | base64 -d
```

# 2. Kustomize

```bash
# 查看资源结果文件
kubectl kustomize

# 应用变更
kubectl apply -k .

# 清除
kubectl delete -k .
```

# 3. [搭建 Knative](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml)

## 3.1 安装 Serving

```bash
# Install the required custom resources by running the command
k apply -f knative/serving-crds.yaml
# Install the core components of Knative Serving by running the command
k apply -f knative/serving-core.yaml
```

## 3.2 安装网络层

```bash
# Install a networking layer
# Install the Knative Kourier controller by running the command
k apply -f knative/kourier.yaml
# Configure Knative Serving to use Kourier by default by running the command
k patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

# Fetch the External IP address or CNAME by running the command
kubectl --namespace kourier-system get service kourier
```

## 3.3 验证安装

```bash
kubectl get pods -n knative-serving
```

## 3.4 配置 DNS

```bash
k apply -f ./knative/serving-default-domain.yaml
```

## 3.5 其他可选安装

- HPA

```bash
k apply -f knative/serving-hpa.yaml
```

# 4. Serving 练习

```bash
# 部署 serving 应用
k apply -k .
# 查看
k get ksvc
NAME          URL                                              LATESTCREATED       LATESTREADY         READY   REASON
dev-restapi   http://dev-restapi.tutorial.127.0.0.1.sslip.io   dev-restapi-00004   dev-restapi-00004   True
```

注意: 即使是本地单节点, serving 的镜像也不能是本地的否则报错:

```
Revision "dev-restapi-00001" failed with message: Unable to fetch image "local/restapi:latest": failed to resolve image to diges │
│ t: HEAD https://index.docker.io/v2/local/restapi/manifests/latest: unexpected status code 401 Unauthorized (HEAD responses have no body, use GET for details).
```

注意: .sslip.io 后缀是因为配置 DNS 使用了 Magic DNS(sslip.io)
